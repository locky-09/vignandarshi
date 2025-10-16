import { NextRequest, NextResponse } from 'next/server'
import { apiLogger } from '@/lib/api-logger'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const endpoint = searchParams.get('endpoint')
  const stats = searchParams.get('stats') === 'true'

  if (stats) {
    return NextResponse.json(apiLogger.getStats())
  }

  if (endpoint) {
    return NextResponse.json(apiLogger.getLogsByEndpoint(endpoint, limit))
  }

  return NextResponse.json(apiLogger.getLogs(limit))
}

export async function DELETE() {
  apiLogger.clear()
  return NextResponse.json({ message: 'Logs cleared' })
}
