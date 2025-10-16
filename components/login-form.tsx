"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function LoginForm({ className }: { className?: string }) {
  const [role, setRole] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      setSuccess(true)
      
      // Redirect based on role
      if (role === "student") {
        router.push("/student")
        return
      }
      if (role === "teacher") {
        router.push("/teacher")
        return
      }
      if (role === "organiser") {
        router.push("/organiser")
        return
      }
      if (role === "admin") {
        router.push("/admin")
        return
      }

      setTimeout(() => setSuccess(false), 1200)
    } catch (error: any) {
      console.error("Login error:", error)
      alert(error.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        "relative w-full rounded-2xl border border-border/40 bg-card/60 backdrop-blur-lg",
        "bg-[linear-gradient(to_bottom_right,color-mix(in_oklab,var(--brand-primary)_8%,transparent),color-mix(in_oklab,var(--brand-accent)_8%,transparent))]",
        "shadow-[0_8px_32px_rgba(31,38,135,0.20)] animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>Access your classroom booking dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="mb-3 flex items-center justify-center">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 animate-bounce">
              <path
                d="M20 7L10 17l-6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-2 text-sm">Signed in!</span>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="role">Select role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={cn(
                "h-12 w-full rounded-md border bg-background/70 px-3 text-sm outline-none",
                "ring-offset-background transition-all",
                "hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring",
                "backdrop-blur-sm",
              )}
              aria-label="Select role"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="organiser">Organiser</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="relative">
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer h-12 bg-background/70 placeholder-transparent"
            />
            <Label
              htmlFor="email"
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all",
                "peer-focus:text-xs peer-focus:top-2 peer-focus:-translate-y-0",
                "peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:-translate-y-0",
              )}
            >
              Email
            </Label>
          </div>

          <div className="relative">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer h-12 bg-background/70 placeholder-transparent"
            />
            <Label
              htmlFor="password"
              className={cn(
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all",
                "peer-focus:text-xs peer-focus:top-2 peer-focus:-translate-y-0",
                "peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:-translate-y-0",
              )}
            >
              Password
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading || !role}
            className={cn(
              "h-10 w-full rounded-md px-4 font-medium text-[color:var(--hero-foreground)]",
              "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]",
              "transition-all duration-300 shadow-md",
              "hover:shadow-[0_0_15px_rgba(79,172,254,0.6)]",
            )}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
