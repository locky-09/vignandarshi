"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Search, Map, List, Bell, CalendarDays } from "lucide-react"

type RoomStatus = "free" | "reserved" | "occupied"

type BuildingId = "dharithri" | "main" | "medha"

const BUILDINGS: { id: BuildingId; name: string }[] = [
  { id: "dharithri", name: "Dharithri" },
  { id: "main", name: "Main" },
  { id: "medha", name: "Medha" },
]

type Room = {
  id: string
  label: string
  building: BuildingId
  capacity: number
  facilities: string[]
  status: RoomStatus
}

const ROOMS: Room[] = [
  {
    id: "A-100",
    label: "A-100",
    building: "dharithri",
    capacity: 30,
    facilities: ["AC", "Projector"],
    status: "occupied",
  },
  {
    id: "A-101",
    label: "A-101",
    building: "main",
    capacity: 30,
    facilities: ["AC", "Projector", "WiFi"],
    status: "free",
  },
  { id: "A-102", label: "A-102", building: "medha", capacity: 40, facilities: ["AC", "WiFi"], status: "reserved" },
  {
    id: "A-103",
    label: "A-103",
    building: "dharithri",
    capacity: 50,
    facilities: ["AC", "Projector", "Smart Board"],
    status: "free",
  },
  { id: "A-104", label: "A-104", building: "main", capacity: 20, facilities: ["AC", "WiFi"], status: "reserved" },
  { id: "A-105", label: "A-105", building: "medha", capacity: 30, facilities: ["AC", "Projector"], status: "occupied" },
  { id: "A-106", label: "A-106", building: "dharithri", capacity: 30, facilities: ["AC"], status: "reserved" },
  { id: "A-107", label: "A-107", building: "main", capacity: 30, facilities: ["AC", "Projector"], status: "free" },
  { id: "A-108", label: "A-108", building: "dharithri", capacity: 40, facilities: ["AC", "WiFi"], status: "reserved" },
  { id: "A-109", label: "A-109", building: "medha", capacity: 40, facilities: ["AC"], status: "free" },
  { id: "A-110", label: "A-110", building: "main", capacity: 35, facilities: ["AC"], status: "occupied" },
  { id: "A-111", label: "A-111", building: "medha", capacity: 28, facilities: ["AC", "WiFi"], status: "free" },
  { id: "A-112", label: "A-112", building: "dharithri", capacity: 24, facilities: ["AC"], status: "reserved" },
  { id: "A-113", label: "A-113", building: "dharithri", capacity: 26, facilities: ["AC", "Projector"], status: "free" },
  { id: "A-114", label: "A-114", building: "main", capacity: 30, facilities: ["AC"], status: "reserved" },
  { id: "A-115", label: "A-115", building: "main", capacity: 30, facilities: ["AC", "WiFi"], status: "free" },
  { id: "A-116", label: "A-116", building: "medha", capacity: 30, facilities: ["AC"], status: "free" },
  { id: "A-117", label: "A-117", building: "medha", capacity: 25, facilities: ["AC", "WiFi"], status: "free" },
]

type View = "overview" | "rooms" | "timetable" | "notifications"

export default function StudentDashboardPage() {
  const [view, setView] = React.useState<View>("overview")
  const [query, setQuery] = React.useState("")
  const [mapView, setMapView] = React.useState(true)
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null)
  const [selectedBuilding, setSelectedBuilding] = React.useState<BuildingId | null>(null)
  const [version, setVersion] = React.useState(0)

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "admin-requests") setVersion((v) => v + 1)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const stats = React.useMemo(() => {
    const total = ROOMS.length
    const baseOccupied = ROOMS.filter((r) => r.status === "occupied").length
    const baseReserved = ROOMS.filter((r) => r.status === "reserved").length

    let todayApproved = 0
    try {
      const raw = localStorage.getItem("admin-requests")
      if (raw) {
        const rows: Array<{ status: string; date: string }> = JSON.parse(raw)
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, "0")
        const dd = String(today.getDate()).padStart(2, "0")
        const todayStr = `${yyyy}-${mm}-${dd}`
        todayApproved = rows.filter((r) => r.status === "approved" && r.date === todayStr).length
      }
    } catch {}

    const reserved = baseReserved + todayApproved
    const occupied = baseOccupied
    const freeLabs = Math.max(0, total - (reserved + occupied))

    return { total, occupied, freeLabs }
  }, [version])

  const filtered = React.useMemo(() => {
    const byBuilding = selectedBuilding ? ROOMS.filter((r) => r.building === selectedBuilding) : ROOMS
    if (!query) return byBuilding
    const q = query.toLowerCase()
    return byBuilding.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.facilities.join(" ").toLowerCase().includes(q),
    )
  }, [query, selectedBuilding])

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <Topbar />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-[260px_1fr] md:p-8">
        {/* Sidebar */}
        <Sidebar current={view} onChange={setView} />

        {/* Content */}
        <section className="space-y-6">
          {view === "overview" && (
            <>
              <Banner />
              <OverviewCards stats={stats} />
            </>
          )}

          {view === "rooms" && (
            <>
              {!selectedBuilding ? (
                <Card className="overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur">
                  <div className="relative h-40 w-full overflow-hidden">
                    {/* Blueprint header - must use Source URL per instruction */}
                    <img src="/images/v1.jpg" alt="Classroom banner" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[oklch(0_0_0/_0.2)]" />
                    <div className="absolute inset-0 flex items-end p-4 md:p-6">
                      <h3 className="text-lg font-semibold text-[oklch(0.98_0_0)]">Select a Block</h3>
                    </div>
                  </div>
                  <CardContent className="space-y-4 p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {BUILDINGS.map((b) => {
                        const count = ROOMS.filter((r) => r.building === b.id).length
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBuilding(b.id)}
                            className="rounded-2xl border border-border/60 bg-card/70 p-4 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Open ${b.name} block`}
                          >
                            <div className="mb-3 h-24 w-full overflow-hidden rounded-xl bg-accent/60">
                              <img
                                src="/images/campus.jpg"
                                alt={`${b.name} block`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-base font-semibold">{b.name}</div>
                                <div className="text-sm text-muted-foreground">{count} rooms</div>
                              </div>
                              <span aria-hidden className="text-xl">
                                ›
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="overflow-hidden rounded-2xl border border-border/50 bg-card/70 backdrop-blur">
                    <div className="relative h-40 w-full overflow-hidden">
                      <img src="/images/v1.jpg" alt="Classroom banner" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-[oklch(0_0_0/_0.15)]" />
                    </div>
                    <CardContent className="-mt-8 space-y-4 p-4 md:p-6">
                      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBuilding(null)}
                            className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent"
                            aria-label="Back to Buildings"
                          >
                            ← Blocks
                          </button>
                          <div className="text-sm text-muted-foreground">
                            {BUILDINGS.find((b) => b.id === selectedBuilding)?.name}
                          </div>
                        </div>
                        <div className="relative w-full md:max-w-md">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                          <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search rooms, facilities..."
                            className="h-11 pl-9"
                            aria-label="Search rooms"
                          />
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 p-1 backdrop-blur">
                          <button
                            type="button"
                            onClick={() => setMapView(true)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
                              mapView ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                            aria-pressed={mapView}
                          >
                            <Map className="h-4 w-4" />
                            Map View
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapView(false)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
                              !mapView ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                            aria-pressed={!mapView}
                          >
                            <List className="h-4 w-4" />
                            List View
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <LegendDot color="bg-emerald-500" label="Free" />
                        <LegendDot color="bg-amber-400" label="Reserved" />
                        <LegendDot color="bg-red-500" label="Occupied" />
                      </div>

                      {mapView ? (
                        <RoomPillsGrid rooms={filtered} onSelect={setSelectedRoom} />
                      ) : (
                        <RoomList cards={filtered} onSelect={setSelectedRoom} />
                      )}
                    </CardContent>
                  </Card>

                  <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
                </>
              )}
            </>
          )}

          {view === "timetable" && <Timetable />}
          {view === "notifications" && <Notifications />}
        </section>
      </div>
    </main>
  )
}

function Topbar() {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-6 w-6 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, color-mix(in oklch, var(--brand-primary) 80%, transparent), var(--brand-accent))",
            }}
          />
          <span className="text-base font-semibold">LearnSpace</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => router.push("/")}
            className="rounded-full px-3 py-1.5 text-sm border hover:bg-muted transition-colors"
            aria-label="Back to Home"
          >
            {"<"} Home
          </button>
          <span className="hidden text-sm text-muted-foreground md:inline">Hi, Student</span>
          <button
            onClick={() => router.push("/login")}
            className="rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] px-3 py-1.5 text-[oklch(0.98_0_0)] hover:shadow-[0_0_18px_color-mix(in_oklch,var(--brand-accent)_40%,transparent)]"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

function Sidebar({ current, onChange }: { current: View; onChange: (v: View) => void }) {
  const items: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <span aria-hidden>🏠</span> },
    { key: "rooms", label: "View Rooms", icon: <span aria-hidden>🏫</span> },
    { key: "timetable", label: "Timetable", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ]
  return (
    <aside className="h-fit rounded-2xl border border-border/60 bg-sidebar p-2 md:sticky md:top-20 md:h-[calc(100dvh-7rem)] md:p-4">
      <nav className="flex flex-row gap-2 md:flex-col">
        {items.map((it) => {
          const active = current === it.key
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={cn(
                "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                active
                  ? "bg-sidebar-accent text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="inline-flex items-center gap-2">
                {it.icon}
                {it.label}
              </span>
            </button>
          )
        })}
      </nav>
      <div className="mt-4 hidden text-xs text-muted-foreground md:block">Role: student</div>
    </aside>
  )
}

function Banner() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      <div className="relative h-56 w-full">
        <img
          src="/images/v1.jpg"
          alt="LearnSpace classroom banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[oklch(0_0_0/_0.18)]" />
        <div className="relative z-10 flex h-full items-center p-6 md:p-8">
          <div>
            <h2 className="text-balance text-3xl font-semibold text-[oklch(0.98_0_0)] md:text-4xl">
              Reserve smart. Learn better.
            </h2>
            <p className="mt-2 max-w-xl text-[oklch(0.98_0_0/_0.85)]">
              Live availability, approvals, and reminders — all in one place. Student view is read-only.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function OverviewCards({ stats }: { stats: { total: number; occupied: number; freeLabs: number } }) {
  const items = [
    { title: "Total Rooms Available", value: stats.total },
    { title: "Currently Occupied", value: stats.occupied },
    { title: "Labs Available Today", value: stats.freeLabs },
  ]
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("inline-block h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  )
}

function statusColor(status: RoomStatus) {
  switch (status) {
    case "free":
      return "bg-emerald-500"
    case "reserved":
      return "bg-amber-400"
    case "occupied":
      return "bg-red-500"
  }
}

function RoomPillsGrid({ rooms, onSelect }: { rooms: Room[]; onSelect: (r: Room) => void }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-9">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room)}
            className={cn(
              "group rounded-lg px-2 py-1 text-[11px] font-medium text-foreground shadow-sm transition",
              "hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "bg-accent/70 backdrop-blur",
            )}
            aria-label={`Room ${room.label}`}
          >
            <span
              className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle", statusColor(room.status))}
            />
            {room.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function RoomList({ cards, onSelect }: { cards: Room[]; onSelect: (r: Room) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((r) => (
        <Card
          key={r.id}
          className="group rounded-2xl border border-border/60 bg-card/70 shadow-sm transition hover:shadow-xl"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{r.label}</CardTitle>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs text-[oklch(0.18_0_0)]",
                r.status === "free" && "bg-emerald-400",
                r.status === "reserved" && "bg-amber-300",
                r.status === "occupied" && "bg-red-400",
              )}
            >
              {r.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              Building {r.building} • {r.capacity} seats
            </div>
            <div className="flex flex-wrap gap-2">
              {r.facilities.map((f) => (
                <span key={f} className="rounded-full bg-accent px-2 py-0.5 text-xs text-foreground">
                  {f}
                </span>
              ))}
            </div>
            <div className="pt-1">
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => onSelect(r)}
                aria-label={`Details for ${r.label}`}
              >
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RoomModal({ room, onClose }: { room: Room | null; onClose: () => void }) {
  if (!room) return null
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-[oklch(0_0_0/_0.4)] p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${room.label}`}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-5 shadow-2xl backdrop-blur">
        <button
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition hover:bg-accent"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="mb-2 text-xl font-semibold">{`Room ${room.label}`}</h3>
        <div className="mb-3 text-sm text-muted-foreground">
          Building {room.building} • Capacity {room.capacity}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {room.facilities.map((f) => (
            <span key={f} className="rounded-full bg-accent px-2 py-0.5 text-xs text-foreground">
              {f}
            </span>
          ))}
          <span
            className={cn(
              "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs",
              room.status === "free" && "bg-emerald-500/90 text-[oklch(0.98_0_0)]",
              room.status === "reserved" && "bg-amber-400/90 text-[oklch(0.18_0_0)]",
              room.status === "occupied" && "bg-red-500/90 text-[oklch(0.98_0_0)]",
            )}
          >
            {room.status}
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm">
          Current Booking Status is shown above. Student mode is view-only — bookings are disabled.
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="rounded-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

function Timetable() {
  const rows = [
    { time: "08:00-09:00", subject: "Maths-II", room: "A-101", faculty: "Dr. Rao" },
    { time: "09:00-10:00", subject: "Physics", room: "A-104", faculty: "Prof. Iyer" },
    { time: "10:00-11:00", subject: "C Programming", room: "Lab-1", faculty: "Ms. Jain" },
  ]
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle>Today&apos;s Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2">Time</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Room</th>
                <th className="py-2">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.time} className="border-t border-border/60">
                  <td className="py-2">{r.time}</td>
                  <td className="py-2">{r.subject}</td>
                  <td className="py-2">{r.room}</td>
                  <td className="py-2">{r.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function Notifications() {
  const list = [
    { id: 1, text: "Lab A-105 reserved today for project demo.", tone: "info" },
    { id: 2, text: "Seminar Hall unavailable this afternoon.", tone: "warn" },
  ]
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.map((n) => (
          <div
            key={n.id}
            className={cn(
              "rounded-xl border border-border/60 p-3 text-sm",
              n.tone === "warn" ? "bg-amber-50 text-foreground" : "bg-accent/60",
            )}
          >
            {n.text}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
