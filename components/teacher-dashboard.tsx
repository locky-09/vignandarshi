"use client"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TeacherDashboard() {
  const router = useRouter()

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
            <span className="text-sm text-muted-foreground">Hi, Faculty</span>
            <button
              onClick={() => router.push("/login")}
              className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground text-sm hover:opacity-90"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Shell */}
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
            <button
              className="w-full whitespace-nowrap rounded-xl px-3 py-2 text-left hover:bg-muted transition"
              onClick={() => router.push("/teacher/quick-booking")}
            >
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
          {/* Overview/Hero */}
          <Card className="overflow-hidden rounded-3xl">
            <div className="relative h-56 w-full">
              <img
                src="/images/v1.jpg"
                alt="LearnSpace classroom"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-transparent" />
              <div className="relative z-10 p-6 md:p-8 text-white max-w-xl">
                <h2 className="text-3xl md:text-4xl font-semibold text-balance">Reserve smart. Teach better.</h2>
                <p className="mt-2 text-sm md:text-base opacity-90">
                  Live availability, approvals, and reminders — all in one place.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => router.push("/teacher/quick-booking")}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow hover:shadow-lg transition-shadow"
                  >
                    Quick Booking
                  </Button>
                  <Button onClick={() => router.push("/teacher/requests")} variant="secondary" className="rounded-full">
                    My Requests
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Feature cards only */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card
              onClick={() => router.push("/teacher/quick-booking")}
              role="button"
              tabIndex={0}
              className="p-4 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label="Quick Booking"
            >
              <div className="text-base font-medium">Quick Booking</div>
              <p className="text-sm text-muted-foreground mt-1">Book a room in two clicks.</p>
            </Card>
            <Card
              onClick={() => router.push("/teacher/requests")}
              role="button"
              tabIndex={0}
              className="p-4 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label="My Requests"
            >
              <div className="text-base font-medium">My Requests</div>
              <p className="text-sm text-muted-foreground mt-1">Track approvals and changes.</p>
            </Card>
            <Card
              onClick={() => router.push("/teacher/rooms")}
              role="button"
              tabIndex={0}
              className="p-4 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label="Room Status"
            >
              <div className="text-base font-medium">Room Status</div>
              <p className="text-sm text-muted-foreground mt-1">See live availability.</p>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
