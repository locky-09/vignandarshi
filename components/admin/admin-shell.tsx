"use client"

import { cn } from "@/lib/utils"
import { LogOut, LayoutDashboard, ListChecks, Users, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type * as React from "react"

type TabKey = "dashboard" | "pending" | "users" | "approved" | "rejected"

export function AdminShell({
  active,
  onChange,
  children,
}: {
  active: TabKey
  onChange: (t: TabKey) => void
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <div className="min-h-[100dvh] bg-[color:var(--background)]">
      {/* Navbar */}
      <header className="sticky top-0 z-20 w-full border-b border-border/50 bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-pretty font-semibold">
            <span className="rounded-md bg-[color:var(--brand-primary)]/15 px-2 py-1 text-sm text-[color:var(--brand-primary)]">
              LearnSpace
            </span>{" "}
            <span className="ml-2 text-base text-muted-foreground">Admin Panel</span>
          </h1>
          <div className="flex items-center gap-2">
            {/* Replace Settings with Home button */}
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-sm hover:bg-muted transition-colors"
              onClick={() => router.push("/")}
              aria-label="Back to Home"
            >
              {"<"} Home
            </button>
            {/* Add greeting consistent with other roles */}
            <span className="hidden text-sm text-muted-foreground md:inline">Hi, Admin</span>
            {/* Keep Logout, make rounded-full to match */}
            <button
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-primary)] px-3 py-1.5 text-sm text-[color:var(--hero-foreground)] shadow hover:opacity-90"
              onClick={() => router.push("/login")}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="sticky top-[64px] h-fit rounded-2xl border border-border/50 bg-card/60 p-2 backdrop-blur">
          <NavItem
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => onChange("dashboard")}
          />
          <NavItem
            icon={<ListChecks className="h-4 w-4" />}
            label="Pending Requests"
            active={active === "pending"}
            onClick={() => onChange("pending")}
          />
          <NavItem
            icon={<Users className="h-4 w-4" />}
            label="Manage Users"
            active={active === "users"}
            onClick={() => onChange("users")}
          />
          <NavItem
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Approved Requests"
            active={active === "approved"}
            onClick={() => onChange("approved")}
          />
          <NavItem
            icon={<XCircle className="h-4 w-4" />}
            label="Rejected Requests"
            active={active === "rejected"}
            onClick={() => onChange("rejected")}
          />
        </aside>

        {/* Main */}
        <main
          className={cn(
            "rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur",
            "shadow-[0_8px_32px_rgba(31,38,135,0.15)]",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
        active
          ? "bg-[color:var(--brand-primary)]/15 text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
