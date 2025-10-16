"use client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import LogoutButton from "@/components/logout-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

function RequestCard({
  room,
  date,
  time,
  status,
  onCancel,
}: { room: string; date: string; time: string; status: "Pending" | "Approved" | "Rejected"; onCancel?: () => void }) {
  const chip = {
    Pending: "bg-gray-100 text-gray-700 border-gray-200",
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  }[status]
  return (
    <Card className="p-4 rounded-2xl border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="font-medium">Room {room}</div>
        <span className={cn("px-2 py-0.5 text-xs rounded-full border", chip)}>{status}</span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {date} {time}
      </div>
      {status === "Pending" ? (
        <div className="mt-3 flex justify-end">
          <Button variant="secondary" className="rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : null}
    </Card>
  )
}

export default function TeacherRequestsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [rows, setRows] = React.useState([
    { id: 1, room: "A-101", date: "2025-10-12", time: "09:00-10:00", status: "Pending" as const },
    { id: 2, room: "B-207", date: "2025-10-13", time: "14:00-15:00", status: "Approved" as const },
  ])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("teacher-requests")
      if (raw) {
        const parsed = JSON.parse(raw)
        // Basic shape check
        if (Array.isArray(parsed)) setRows(parsed)
      }
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("teacher-requests", JSON.stringify(rows))
    } catch {}
  }, [rows])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" aria-hidden />
            <span className="font-semibold">LearnSpace</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/teacher")}
              className="rounded-full px-3 py-1.5 text-sm border hover:bg-muted transition-colors"
            >
              {"<"} Dashboard
            </button>
            <span className="text-sm text-muted-foreground">Hi, Faculty</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <aside className="rounded-2xl border bg-card text-card-foreground shadow-sm p-3 md:p-4">
          <nav className="flex md:flex-col gap-2">
            <button
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher")}
            >
              Overview
            </button>
            <button
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/quick-booking")}
            >
              Quick Booking
            </button>
            <button className="w-full rounded-xl px-3 py-2 text-left bg-muted/60">My Requests</button>
            <button
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/rooms")}
            >
              Room Status
            </button>
            <div className="px-3 pt-2 text-xs text-muted-foreground">Role: teacher</div>
          </nav>
        </aside>

        <section className="space-y-6">
          <Card className="overflow-hidden rounded-3xl">
            <div className="relative h-56 w-full">
              <img
                src="/images/v1.jpg"
                alt="LearnSpace classroom"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 md:p-8 text-white max-w-xl">
                <h2 className="text-3xl md:text-4xl font-semibold text-balance">My Requests</h2>
                <p className="mt-2 text-sm md:text-base opacity-90">Track approvals and changes.</p>
              </div>
            </div>
          </Card>

          {/* replace static cards with mapped cards that can be canceled */}
          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((r) => (
              <RequestCard
                key={r.id}
                room={r.room}
                date={r.date}
                time={r.time}
                status={r.status}
                onCancel={
                  r.status === "Pending"
                    ? () => {
                        setRows((prev) => prev.filter((x) => x.id !== r.id))
                        toast({ title: "Request canceled", description: `${r.room} • ${r.date} ${r.time}` })
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
