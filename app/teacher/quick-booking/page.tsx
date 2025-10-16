"use client"

import type * as React from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import LogoutButton from "@/components/logout-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeacherQuickBookingPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const facultyName = String(data.get("facultyName") || "")
    const facultyId = String(data.get("facultyId") || "")
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
            faculty_name: facultyName,
            faculty_id: facultyId,
            room_no: roomNo,
            date,
            time_slot: time,
            purpose,
            status: "pending",
          },
        }
        return fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      })
      .catch((err) => {
        console.log("[v0] EmailJS send skipped (teacher quick):", err?.message || err)
      })

    try {
      const newId = Date.now()
      const existingRaw = typeof window !== "undefined" ? localStorage.getItem("teacher-requests") : null
      const existing: Array<{
        id: number
        room: string
        date: string
        time: string
        status: "Pending" | "Approved" | "Rejected"
      }> = existingRaw ? JSON.parse(existingRaw) : []
      const newItem = {
        id: newId,
        room: roomNo || "TBD",
        date,
        time,
        status: "Pending" as const,
      }
      localStorage.setItem("teacher-requests", JSON.stringify([newItem, ...existing]))

      const adminRaw = localStorage.getItem("admin-requests")
      const adminExisting: any[] = adminRaw ? JSON.parse(adminRaw) : []
      const adminItem = {
        id: `T-${newId}`,
        room: roomNo || "TBD",
        userId: facultyId || facultyName || "Faculty",
        role: "Faculty",
        date,
        time,
        message: purpose,
        status: "pending",
        // linkage so admin decisions propagate back
        source: "teacher",
        sourceRef: newId,
        email: "", // optional
      }
      localStorage.setItem("admin-requests", JSON.stringify([adminItem, ...adminExisting]))
    } catch {}

    toast({ title: "Booking Request Sent", description: "Pending approval by Admin." })
    router.push("/teacher/requests")
  }

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
              onClick={() => router.push("/teacher")}
              className="rounded-full px-3 py-1.5 text-sm border hover:bg-muted transition-colors"
              aria-label="Back to Teacher Dashboard"
            >
              {"<"} Dashboard
            </button>
            <span className="text-sm text-muted-foreground">Hi, Faculty</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="rounded-2xl border bg-card text-card-foreground shadow-sm p-3 md:p-4 md:sticky md:top-20 md:h-[calc(100dvh-7rem)] overflow-auto">
          <nav className="flex md:flex-col gap-2">
            <button
              className="w-full whitespace-nowrap rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher")}
            >
              Overview
            </button>
            <button className="w-full whitespace-nowrap rounded-xl px-3 py-2 text-left bg-muted/60">
              Quick Booking
            </button>
            <button
              className="w-full whitespace-nowrap rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/requests")}
            >
              My Requests
            </button>
            <button
              className="w-full whitespace-nowrap rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/rooms")}
            >
              Room Status
            </button>
            <div className="px-3 pt-2 text-xs text-muted-foreground">Role: teacher</div>
          </nav>
        </aside>

        {/* Main */}
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
                <h2 className="text-3xl md:text-4xl font-semibold text-balance">Quick Booking</h2>
                <p className="mt-2 text-sm md:text-base opacity-90">Book a classroom or lab in two clicks.</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg font-medium">New Booking</h3>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-1">Faculty Name</label>
                <Input name="facultyName" placeholder="e.g., Dr. Priya" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Faculty ID</label>
                <Input name="facultyId" placeholder="e.g., 11831" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Room No</label>
                <Input name="room_no" placeholder="e.g., A-101" required />
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
                <label className="block text-sm mb-1">Purpose / Subject</label>
                <Input name="purpose" placeholder="e.g., Project review" required />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </section>
      </div>
    </main>
  )
}
