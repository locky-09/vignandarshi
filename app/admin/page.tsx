"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { SummaryCards } from "@/components/admin/summary-cards"
import { PendingRequests, type RequestItem } from "@/components/admin/pending-requests"
import { ManageUsers } from "@/components/admin/manage-users"
import { ApiLogs } from "@/components/admin/api-logs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TabKey = "dashboard" | "pending" | "users" | "approved" | "rejected" | "logs"

export default function AdminPage() {
  const router = useRouter()
  const [active, setActive] = React.useState<TabKey>("dashboard")
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Requests state must be declared unconditionally (before any early returns)
  const [requests, setRequests] = React.useState<RequestItem[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem("admin-requests")
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  React.useEffect(() => {
    try {
      localStorage.setItem("admin-requests", JSON.stringify(requests))
    } catch {}
  }, [requests])

  // Check authentication on mount
  React.useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        
        if (!data.user || data.user.role !== "Admin") {
          router.push("/login")
          return
        }
        
        setUser(data.user)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totals = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "approved").length,
    pending: requests.filter((r) => r.status === "pending").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  const byRole = [
    { name: "Student", value: requests.filter((r) => r.role === "Student").length },
    { name: "Faculty", value: requests.filter((r) => r.role === "Faculty").length },
    { name: "Organizer", value: requests.filter((r) => r.role === "Organizer").length },
  ]

  function handleRequestsChange(next: RequestItem[]) {
    // detect which items changed status
    const changed = next.filter((n) => {
      const prev = requests.find((p) => p.id === n.id)
      return prev && prev.status !== n.status
    })

    for (const item of changed) {
      const src = (item as any).source as "teacher" | "organiser" | undefined
      const ref = (item as any).sourceRef as number | undefined
      const toRoleStatus = item.status === "approved" ? "Approved" : item.status === "rejected" ? "Rejected" : "Pending"

      try {
        if (src === "teacher" && typeof ref === "number") {
          const raw = localStorage.getItem("teacher-requests")
          const rows: any[] = raw ? JSON.parse(raw) : []
          const updated = rows.map((r) => (r.id === ref ? { ...r, status: toRoleStatus } : r))
          localStorage.setItem("teacher-requests", JSON.stringify(updated))
        } else if (src === "organiser" && typeof ref === "number") {
          const raw = localStorage.getItem("organiser-requests")
          const rows: any[] = raw ? JSON.parse(raw) : []
          const updated = rows.map((r) => (r.id === ref ? { ...r, status: toRoleStatus } : r))
          localStorage.setItem("organiser-requests", JSON.stringify(updated))
        }
      } catch {}
    }

    setRequests(next)
    try {
      localStorage.setItem("admin-requests", JSON.stringify(next))
    } catch {}
  }

  return (
    <AdminShell active={active} onChange={setActive}>
      {active === "dashboard" ? (
        <div>
          {/* Summary Cards */}
          <SummaryCards totals={totals} />

          {/* Shortcuts */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ShortcutCard label="Pending Requests" onClick={() => setActive("pending")} />
            <ShortcutCard label="Manage Users" onClick={() => setActive("users")} />
            <ShortcutCard label="Approved Requests" onClick={() => setActive("approved")} />
            <ShortcutCard label="Rejected Requests" onClick={() => setActive("rejected")} />
            <ShortcutCard label="API Logs" onClick={() => setActive("logs")} />
          </section>
        </div>
      ) : null}

      {active === "pending" ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Pending Requests</h2>
          <PendingRequests data={requests} onChange={handleRequestsChange} />
        </section>
      ) : null}

      {active === "users" ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Manage Users</h2>
          <ManageUsers />
        </section>
      ) : null}

      {active === "approved" ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Approved Requests</h2>
          <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Approved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {requests.filter((r) => r.status === "approved").length === 0 ? (
                <p className="text-sm text-muted-foreground">No approved requests.</p>
              ) : (
                requests
                  .filter((r) => r.status === "approved")
                  .map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <div className="font-medium">
                          {r.room} • {r.date} {r.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {r.userId} ({r.role})
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 border border-emerald-200">
                        approved
                      </span>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {active === "rejected" ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Rejected Requests</h2>
          <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {requests.filter((r) => r.status === "rejected").length === 0 ? (
                <p className="text-sm text-muted-foreground">No rejected requests.</p>
              ) : (
                requests
                  .filter((r) => r.status === "rejected")
                  .map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-xl border p-3">
                      <div>
                        <div className="font-medium">
                          {r.room} • {r.date} {r.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {r.userId} ({r.role})
                        </div>
                      </div>
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700 border border-rose-200">
                        rejected
                      </span>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </section>
      ) : null}

      {active === "logs" ? (
        <section>
          <ApiLogs />
        </section>
      ) : null}
    </AdminShell>
  )
}

function ShortcutCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-border/50 bg-card/60 p-4 text-left backdrop-blur transition hover:bg-card"
    >
      <div className="text-sm text-muted-foreground">Open</div>
      <div className="mt-1 text-base font-semibold">{label}</div>
    </button>
  )
}
