"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Map, List } from "lucide-react"

type Status = "free" | "reserved" | "occupied"

type Hall = {
  id: string
  name: string
  capacity: number
  facilities: string[]
  status: Status
}

const HALLS: Hall[] = [
  { id: "H-101", name: "Seminar Hall A", capacity: 120, facilities: ["Projector", "Audio System"], status: "free" },
  { id: "H-102", name: "Auditorium", capacity: 300, facilities: ["Digital Board", "Audio System"], status: "reserved" },
  { id: "H-103", name: "Conference Hall", capacity: 80, facilities: ["Projector", "WiFi"], status: "occupied" },
  { id: "H-104", name: "Seminar Hall B", capacity: 100, facilities: ["Projector", "WiFi"], status: "free" },
  { id: "H-105", name: "Mini Hall", capacity: 60, facilities: ["Projector"], status: "free" },
]

export default function OrganiserDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [view, setView] = React.useState<"overview" | "halls" | "requests" | "settings">("overview")
  const [query, setQuery] = React.useState("")
  const [toggle, setToggle] = React.useState<"map" | "list">("map")
  const [selected, setSelected] = React.useState<Hall | null>(null)
  const [requestOpen, setRequestOpen] = React.useState(false)

  const [version, setVersion] = React.useState(0)
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "organiser-requests" || e.key === "admin-requests") {
        setVersion((v) => v + 1)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const stats = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("organiser-requests")
      const rows: Array<{ status: "Pending" | "Approved" | "Rejected" }> = raw ? JSON.parse(raw) : []
      const total = rows.length
      const approved = rows.filter((r) => r.status === "Approved").length
      const pending = rows.filter((r) => r.status === "Pending").length
      return { total, approved, pending }
    } catch {
      return { total: 0, approved: 0, pending: 0 }
    }
  }, [version])

  const filtered = React.useMemo(() => {
    if (!query) return HALLS
    const q = query.toLowerCase()
    return HALLS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        h.facilities.some((f) => f.toLowerCase().includes(q)),
    )
  }, [query])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" aria-hidden />
            <span className="font-semibold">LearnSpace</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="rounded-full px-3 py-1.5 text-sm border hover:bg-muted transition-colors"
              aria-label="Back to Home"
            >
              {"<"} Home
            </button>
            <span className="hidden md:inline text-sm text-muted-foreground">Hi, Organiser</span>
            <button
              onClick={() => router.push("/login")}
              className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground text-sm hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-card text-card-foreground shadow-sm p-3 md:p-4 md:sticky md:top-20 md:h-[calc(100dvh-7rem)] overflow-auto">
          <nav className="flex md:flex-col gap-2">
            <button className={navBtn(view === "overview")} onClick={() => setView("overview")}>
              Overview
            </button>
            <button className={navBtn(view === "halls")} onClick={() => setView("halls")}>
              Manage Halls
            </button>
            <button className={navBtn(view === "requests")} onClick={() => setView("requests")}>
              Event Requests
            </button>
            <button className={navBtn(view === "settings")} onClick={() => setView("settings")}>
              Settings
            </button>
          </nav>
          <div className="px-3 pt-2 text-xs text-muted-foreground">Role: organiser</div>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {view === "overview" && (
            <>
              <Banner
                title="Reserve smart. Organize better."
                subtitle="Manage halls, approvals, and reminders — all in one place."
              />
              <OverviewCards
                items={[
                  { title: "Total Events", value: stats.total },
                  { title: "Approved Bookings", value: stats.approved },
                  { title: "Pending Requests", value: stats.pending },
                ]}
              />
            </>
          )}

          {view === "halls" && (
            <>
              <Banner title="Manage Halls" subtitle="Browse halls and request bookings." />
              {/* Search + Toggle + Legend */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  placeholder="Search halls, facilities..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search halls"
                  className="md:flex-1"
                />
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 p-1 backdrop-blur">
                  <button
                    onClick={() => setToggle("map")}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
                      toggle === "map" ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    <Map className="h-4 w-4" /> Map View
                  </button>
                  <button
                    onClick={() => setToggle("list")}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
                      toggle === "list" ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    <List className="h-4 w-4" /> List View
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Legend color="bg-emerald-500" label="Free" />
                <Legend color="bg-amber-500" label="Reserved" />
                <Legend color="bg-red-500" label="Occupied" />
              </div>

              {toggle === "map" ? (
                <Card className="p-4 md:p-6 rounded-2xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filtered.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => setSelected(h)}
                        className="flex items-center justify-center gap-2 rounded-full bg-muted/60 hover:bg-muted px-3 py-2 text-sm"
                        aria-label={`Open ${h.name} details`}
                      >
                        <span className={cn("h-2.5 w-2.5 rounded-full", dot(h.status))} />
                        {h.id}
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-4 md:p-6 rounded-2xl">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((h) => (
                      <Card key={h.id} className="p-4 rounded-2xl border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{h.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {h.id} • {h.capacity} seats
                            </div>
                          </div>
                          <StatusBadge s={h.status} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {h.facilities.map((f) => (
                            <span key={f} className="rounded-full bg-muted px-2 py-1 text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="secondary" className="rounded-full" onClick={() => setSelected(h)}>
                            Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Hall Details Modal */}
              <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <DialogContent className="sm:max-w-lg">
                  {selected ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>{selected.name}</DialogTitle>
                        <DialogDescription>
                          {selected.id} • Capacity: {selected.capacity}{" "}
                          <span className="ml-2 inline-block">
                            <StatusBadge s={selected.status} />
                          </span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-wrap gap-2">
                        {selected.facilities.map((f) => (
                          <span key={f} className="rounded-full bg-muted px-2 py-1 text-xs">
                            {f}
                          </span>
                        ))}
                      </div>
                      <DialogFooter className="gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-full"
                          onClick={() => setSelected(null)}
                        >
                          Close
                        </Button>
                        {selected.status === "free" ? (
                          <Button
                            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                            onClick={() => {
                              setSelected(null)
                              setRequestOpen(true) // open booking form
                            }}
                          >
                            Book Now
                          </Button>
                        ) : null}
                      </DialogFooter>
                    </>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Booking Form Dialog */}
              <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Request Event Hall</DialogTitle>
                    <DialogDescription>Fill the details to send a request.</DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const form = e.currentTarget
                      const data = new FormData(form)
                      const organizerName = String(data.get("organizerName") || "")
                      const eventName = String(data.get("eventName") || "")
                      const hallName = String(data.get("hallName") || "")
                      const roomNo = String(data.get("room_no") || "")
                      const date = String(data.get("date") || "")
                      const time = String(data.get("time") || "")
                      const purpose = String(data.get("purpose") || "")

                      fetch("/api/email/config")
                        .then((r) => r.json())
                        .then((cfg) => {
                          if (!cfg?.ok) return
                          const payload = {
                            service_id: cfg.serviceId,
                            template_id: cfg.templateId,
                            user_id: cfg.publicKey,
                            template_params: {
                              faculty_name: organizerName,
                              faculty_id: eventName,
                              room_no: roomNo || hallName,
                              date,
                              time_slot: time,
                              purpose,
                              status: "pending",
                            },
                          }
                          // Call EmailJS from the browser to satisfy their security policy
                          return fetch("https://api.emailjs.com/api/v1.0/email/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          })
                        })
                        .catch((err) => {
                          console.log("[v0] EmailJS send skipped (organiser):", err?.message || err)
                        })

                      try {
                        const newId = Date.now()
                        const raw = localStorage.getItem("organiser-requests")
                        const existing: Array<{
                          id: number
                          event: string
                          hall: string
                          when: string
                          status: "Pending" | "Approved" | "Rejected"
                        }> = raw ? JSON.parse(raw) : []
                        const newItem = {
                          id: newId,
                          event: eventName || "Untitled Event",
                          hall: roomNo || hallName || "TBD Room",
                          when: `${date} ${time}`,
                          status: "Pending" as const,
                        }
                        localStorage.setItem("organiser-requests", JSON.stringify([newItem, ...existing]))

                        const adminRaw = localStorage.getItem("admin-requests")
                        const adminExisting: any[] = adminRaw ? JSON.parse(adminRaw) : []
                        const adminItem = {
                          id: `O-${newId}`,
                          room: roomNo || hallName || "TBD Room",
                          userId: organizerName || eventName || "Organizer",
                          role: "Organizer",
                          date,
                          time,
                          message: purpose,
                          status: "pending",
                          source: "organiser",
                          sourceRef: newId,
                          email: "",
                        }
                        localStorage.setItem("admin-requests", JSON.stringify([adminItem, ...adminExisting]))
                      } catch {}

                      toast({ title: "Request Sent", description: "We emailed admin and recorded your request." })
                      setRequestOpen(false)
                      setView("requests")
                    }}
                    className="grid gap-3"
                  >
                    <div>
                      <label className="block text-sm mb-1">Organizer Name</label>
                      <Input name="organizerName" placeholder="e.g., John Doe" required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Event Name</label>
                      <Input name="eventName" placeholder="e.g., Tech Talk" required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Hall Name</label>
                      <Input name="hallName" placeholder="e.g., Seminar Hall A" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Room No</label>
                      <Input name="room_no" placeholder="e.g., H-101" required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Date</label>
                      <Input name="date" type="date" required />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Time Slot</label>
                      <select name="time" className="h-10 w-full rounded-md border bg-background px-3 text-sm" required>
                        <option value="08:00-09:00">08:00-09:00</option>
                        <option value="09:00-10:00">09:00-10:00</option>
                        <option value="14:00-15:00">14:00-15:00</option>
                        <option value="16:00-17:00">16:00-17:00</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Purpose / Description</label>
                      <Input name="purpose" placeholder="e.g., Annual fest briefing" required />
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => setRequestOpen(false)}
                      >
                        Close
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                      >
                        Submit
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}

          {view === "requests" && (
            <>
              <Banner title="Event Requests" subtitle="Review and take action." />
              <OrganiserRequestsList />
            </>
          )}

          {view === "settings" && (
            <>
              <Banner title="Settings" subtitle="Configure organizer preferences." />
              <Card className="p-4 md:p-6 rounded-2xl text-sm text-muted-foreground">
                Basic settings placeholder. We can add real settings later.
              </Card>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

function navBtn(active: boolean) {
  return cn(
    "w-full whitespace-nowrap rounded-xl px-3 py-2 text-left transition",
    active ? "bg-muted/60" : "hover:bg-muted",
  )
}

function Banner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      <div className="relative h-56 w-full">
        <img src="/images/v1.jpg" alt="Banner" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[oklch(0_0_0/_0.18)]" />
        <div className="relative z-10 flex h-full items-center p-6 md:p-8">
          <div>
            <h2 className="text-balance text-3xl font-semibold text-[oklch(0.98_0_0)] md:text-4xl">{title}</h2>
            <p className="mt-2 max-w-xl text-[oklch(0.98_0_0/_0.85)]">{subtitle}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function OverviewCards({ items }: { items: { title: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <Card
          key={it.title}
          className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur shadow-sm transition hover:shadow-md"
        >
          <CardContent className="flex h-28 flex-col justify-between p-4 sm:h-28">
            <div className="text-sm font-medium text-muted-foreground">{it.title}</div>
            <div className="text-2xl font-bold tracking-tight">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={cn("inline-block h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  )
}

function dot(s: Status) {
  return {
    free: "bg-emerald-500",
    reserved: "bg-amber-500",
    occupied: "bg-red-500",
  }[s]
}

function StatusBadge({ s }: { s: Status }) {
  const map = {
    free: "bg-emerald-100 text-emerald-700 border-emerald-200",
    reserved: "bg-amber-100 text-amber-700 border-amber-200",
    occupied: "bg-red-100 text-red-700 border-red-200",
  }
  return <span className={cn("px-2 py-0.5 text-xs rounded-full border", map[s])}>{s}</span>
}

function OrganiserRequestsList() {
  const [rows, setRows] = React.useState<
    Array<{ id: number; event: string; hall: string; when: string; status: "Pending" | "Approved" | "Rejected" }>
  >([])

  React.useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("organiser-requests")
        const data = raw ? JSON.parse(raw) : []
        if (Array.isArray(data)) setRows(data)
      } catch {}
    }
    load()
    const onStorage = (e: StorageEvent) => {
      if (e.key === "organiser-requests") load()
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rows.length === 0 ? (
        <Card className="p-4 rounded-2xl text-sm text-muted-foreground">No requests yet.</Card>
      ) : (
        rows.map((r) => (
          <Card key={r.id} className="p-4 rounded-2xl border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="font-medium">{r.event}</div>
              <span
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full border",
                  r.status === "Pending" && "bg-gray-100 text-gray-700 border-gray-200",
                  r.status === "Approved" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                  r.status === "Rejected" && "bg-red-100 text-red-700 border-red-200",
                )}
              >
                {r.status}
              </span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {r.hall} • {r.when}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
