"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import LogoutButton from "@/components/logout-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

type Status = "free" | "reserved" | "occupied"
type BuildingId = "dharithri" | "main" | "medha"
type Room = {
  id: string
  building: BuildingId
  capacity: number
  facilities: string[]
  status: Status
}

const BUILDINGS: { id: BuildingId; name: string }[] = [
  { id: "dharithri", name: "Dharithri" },
  { id: "main", name: "Main" },
  { id: "medha", name: "Medha" },
]

const ROOMS: Room[] = [
  {
    id: "A-100",
    building: "dharithri",
    capacity: 20,
    facilities: ["AC", "Projector", "Smart Board"],
    status: "occupied",
  },
  { id: "A-101", building: "main", capacity: 30, facilities: ["AC", "Projector", "WiFi"], status: "free" },
  { id: "A-102", building: "medha", capacity: 40, facilities: ["AC", "WiFi"], status: "reserved" },
  { id: "A-103", building: "dharithri", capacity: 50, facilities: ["AC", "Projector", "Smart Board"], status: "free" },
  { id: "A-104", building: "main", capacity: 20, facilities: ["AC", "Projector", "WiFi"], status: "reserved" },
  { id: "A-105", building: "medha", capacity: 30, facilities: ["AC", "Projector"], status: "occupied" },
  { id: "A-106", building: "dharithri", capacity: 30, facilities: ["AC", "Projector"], status: "reserved" },
  { id: "A-107", building: "dharithri", capacity: 30, facilities: ["AC"], status: "free" },
  { id: "A-108", building: "main", capacity: 20, facilities: ["WiFi"], status: "reserved" },
  { id: "A-109", building: "main", capacity: 40, facilities: ["AC", "Projector", "WiFi"], status: "free" },
  { id: "A-110", building: "main", capacity: 35, facilities: ["AC", "Projector"], status: "free" },
  { id: "A-111", building: "main", capacity: 25, facilities: ["AC"], status: "free" },
  { id: "A-112", building: "medha", capacity: 22, facilities: ["AC"], status: "reserved" },
  { id: "A-113", building: "medha", capacity: 22, facilities: ["AC"], status: "free" },
  { id: "A-114", building: "medha", capacity: 22, facilities: ["AC"], status: "free" },
  { id: "A-115", building: "medha", capacity: 22, facilities: ["AC"], status: "free" },
  { id: "A-116", building: "medha", capacity: 22, facilities: ["AC"], status: "free" },
  { id: "A-117", building: "medha", capacity: 22, facilities: ["AC"], status: "free" },
]

function statusDot(s: Status) {
  return {
    free: "bg-emerald-500",
    reserved: "bg-amber-500",
    occupied: "bg-red-500",
  }[s]
}

function statusBadge(s: Status) {
  const map = {
    free: "bg-emerald-100 text-emerald-700 border-emerald-200",
    reserved: "bg-amber-100 text-amber-700 border-amber-200",
    occupied: "bg-red-100 text-red-700 border-red-200",
  }
  return <span className={cn("px-2 py-0.5 rounded-full text-xs border", map[s])}>{s}</span>
}

export default function TeacherRoomsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [view, setView] = React.useState<"map" | "list">("map")
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<Room | null>(null)
  const [selectedBuilding, setSelectedBuilding] = React.useState<BuildingId | null>(null)

  const filtered = React.useMemo(() => {
    const byBuilding = selectedBuilding ? ROOMS.filter((r) => r.building === selectedBuilding) : ROOMS
    if (!query) return byBuilding
    const q = query.toLowerCase()
    return byBuilding.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.facilities.some((f) => f.toLowerCase().includes(q)),
    )
  }, [query, selectedBuilding])

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
        <aside className="rounded-2xl border bg-card text-card-foreground shadow-sm p-3 md:p-4 md:sticky md:top-20 md:h-[calc(100dvh-7rem)] overflow-auto">
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
            <button
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/requests")}
            >
              My Requests
            </button>
            <button className="w-full rounded-xl px-3 py-2 text-left bg-muted/60">Room Status</button>
            <div className="px-3 pt-2 text-xs text-muted-foreground">Role: teacher</div>
          </nav>
        </aside>

        <section className="space-y-6">
          {!selectedBuilding ? (
            <>
              <Card className="overflow-hidden rounded-3xl">
                <div className="relative h-56 w-full">
                  {/* Blueprint header - must use Source URL per instruction */}
                  <img
                    src="/images/v1.jpg"
                    alt="Classroom banner"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-transparent" />
                  <div className="relative z-10 p-6 md:p-8 text-white max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-semibold text-balance">Select a Block</h2>
                    <p className="mt-2 text-sm md:text-base opacity-90">Choose Dharithri, Main, or Medha.</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {BUILDINGS.map((b) => {
                  const count = ROOMS.filter((r) => r.building === b.id).length
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBuilding(b.id)}
                      className="rounded-2xl border bg-card text-card-foreground p-4 text-left hover:shadow-md transition"
                      aria-label={`Open ${b.name} block`}
                    >
                      <div className="mb-3 h-24 w-full overflow-hidden rounded-xl bg-muted">
                        <img src="/images/campus.jpg" alt={`${b.name} block`} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{b.name}</div>
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
            </>
          ) : (
            <>
              <Card className="overflow-hidden rounded-3xl">
                <div className="relative h-56 w-full">
                  <img
                    src="/images/v1.jpg"
                    alt="LearnSpace classroom"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-transparent" />
                  <div className="relative z-10 p-6 md:p-8 text-white max-w-xl">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedBuilding(null)}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
                        aria-label="Back to Buildings"
                      >
                        ← Blocks
                      </button>
                      <h2 className="text-3xl md:text-4xl font-semibold text-balance">
                        {BUILDINGS.find((b) => b.id === selectedBuilding)?.name} · Room Status
                      </h2>
                    </div>
                    <p className="mt-2 text-sm md:text-base opacity-90">See live availability in this block.</p>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                  placeholder="Search rooms, facilities..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search rooms"
                  className="md:flex-1"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView("map")}
                    className={cn(
                      "rounded-full border px-4 h-10 text-sm",
                      view === "map" ? "bg-muted/60" : "hover:bg-muted/40",
                    )}
                  >
                    Map View
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn(
                      "rounded-full border px-4 h-10 text-sm",
                      view === "list" ? "bg-muted/60" : "hover:bg-muted/40",
                    )}
                  >
                    List View
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Free
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Reserved
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Occupied
                </div>
              </div>

              {view === "map" ? (
                <Card className="p-4 md:p-6 rounded-2xl">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filtered.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className="flex items-center justify-center gap-2 rounded-full bg-muted/60 hover:bg-muted px-3 py-2 text-sm"
                        aria-label={`Open ${r.id} details`}
                      >
                        <span className={cn("h-2.5 w-2.5 rounded-full", statusDot(r.status))} />
                        {r.id}
                      </button>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-4 md:p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((r) => (
                      <Card key={r.id} className="p-4 rounded-2xl border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{r.id}</div>
                            <div className="text-sm text-muted-foreground">
                              Building {BUILDINGS.find((b) => b.id === r.building)?.name} • {r.capacity} seats
                            </div>
                          </div>
                          {statusBadge(r.status)}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.facilities.map((f) => (
                            <span key={f} className="rounded-full bg-muted px-2 py-1 text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="secondary" className="rounded-full" onClick={() => setSelected(r)}>
                            Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
                <DialogContent className="sm:max-w-lg">
                  {selected ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Room {selected.id}</DialogTitle>
                        <DialogDescription>
                          Building {BUILDINGS.find((b) => b.id === selected.building)?.name} • Capacity:{" "}
                          {selected.capacity} <span className="ml-2">{statusBadge(selected.status)}</span>
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
                        <Button variant="secondary" className="rounded-full" onClick={() => setSelected(null)}>
                          Close
                        </Button>
                        {selected.status === "free" ? (
                          <Button
                            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                            onClick={() => {
                              setSelected(null)
                              router.push("/teacher/quick-booking")
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
            </>
          )}
        </section>
      </div>
    </main>
  )
}
