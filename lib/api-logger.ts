import { NextRequest, NextResponse } from 'next/server'

export interface ApiLog {
  id: string
  timestamp: string
  method: string
  url: string
  status: number
  duration: number
  userAgent?: string
  ip?: string
  requestBody?: any
  responseBody?: any
  error?: string
}

class ApiLogger {
  private logs: ApiLog[] = []
  private maxLogs = 1000 // Keep last 1000 requests

  log(request: NextRequest, response: NextResponse, duration: number, requestBody?: any, responseBody?: any, error?: string) {
    const log: ApiLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status: response.status,
      duration,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      requestBody: requestBody ? JSON.parse(JSON.stringify(requestBody)) : undefined,
      responseBody: responseBody ? JSON.parse(JSON.stringify(responseBody)) : undefined,
      error
    }

    this.logs.unshift(log) // Add to beginning
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs) // Keep only recent logs
    }
  }

  getLogs(limit = 50): ApiLog[] {
    return this.logs.slice(0, limit)
  }

  getLogsByEndpoint(endpoint: string, limit = 50): ApiLog[] {
    return this.logs.filter(log => log.url.includes(endpoint)).slice(0, limit)
  }

  getStats() {
    const total = this.logs.length
    const byMethod = this.logs.reduce((acc, log) => {
      acc[log.method] = (acc[log.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = this.logs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const byEndpoint = this.logs.reduce((acc, log) => {
      const endpoint = new URL(log.url).pathname
      acc[endpoint] = (acc[endpoint] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const avgDuration = this.logs.length > 0 
      ? this.logs.reduce((sum, log) => sum + log.duration, 0) / this.logs.length 
      : 0

    const errors = this.logs.filter(log => log.error || log.status >= 400).length

    return {
      total,
      byMethod,
      byStatus,
      byEndpoint,
      avgDuration: Math.round(avgDuration),
      errors,
      errorRate: total > 0 ? (errors / total * 100).toFixed(2) + '%' : '0%'
    }
  }

  clear() {
    this.logs = []
  }
}

export const apiLogger = new ApiLogger()

export function withApiLogging<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now()
    const request = args[0] as NextRequest
    let response: NextResponse
    let requestBody: any
    let responseBody: any
    let error: string | undefined

    // Capture request body
    try {
      if (request.method !== 'GET') {
        const clonedRequest = request.clone()
        requestBody = await clonedRequest.json()
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }

    try {
      response = await handler(...args)
      
      // Capture response body
      try {
        const clonedResponse = response.clone()
        responseBody = await clonedResponse.json()
      } catch (e) {
        // Ignore JSON parsing errors
      }
    } catch (e: any) {
      error = e.message
      response = NextResponse.json({ error: e.message }, { status: 500 })
    }

    const duration = Date.now() - startTime
    apiLogger.log(request, response, duration, requestBody, responseBody, error)

    return response
  }
}
