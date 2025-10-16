"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Trash2, BarChart3 } from "lucide-react"

interface ApiLog {
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

interface ApiStats {
  total: number
  byMethod: Record<string, number>
  byStatus: Record<number, number>
  byEndpoint: Record<string, number>
  avgDuration: number
  errors: number
  errorRate: string
}

export function ApiLogs() {
  const [logs, setLogs] = React.useState<ApiLog[]>([])
  const [stats, setStats] = React.useState<ApiStats | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [showStats, setShowStats] = React.useState(false)

  const loadLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/logs')
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Failed to load logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/logs?stats=true')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const clearLogs = async () => {
    try {
      await fetch('/api/admin/logs', { method: 'DELETE' })
      setLogs([])
      setStats(null)
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }

  React.useEffect(() => {
    loadLogs()
    loadStats()
  }, [])

  const getStatusColor = (status: number) => {
    if (status >= 500) return "destructive"
    if (status >= 400) return "destructive"
    if (status >= 300) return "secondary"
    return "default"
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Usage Logs</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showStats ? 'Hide' : 'Show'} Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearLogs}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {showStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.errorRate}</div>
              <p className="text-xs text-muted-foreground">{stats.errors} errors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDuration}ms</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {Object.entries(stats.byEndpoint)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(stats.byEndpoint)
                  .sort(([,a], [,b]) => b - a)[0]?.[1] || 0} requests
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No API calls logged yet.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(log.status)}>
                      {log.method}
                    </Badge>
                    <Badge variant="outline">
                      {log.status}
                    </Badge>
                    <span className="text-sm font-mono">
                      {new URL(log.url).pathname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(log.duration)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
