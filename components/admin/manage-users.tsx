"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

type User = { id: string; name: string; role: "Student" | "Faculty" | "Organizer"; password: string }

export function ManageUsers() {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)

  const [form, setForm] = React.useState<User>({
    id: "",
    name: "",
    role: "Student",
    password: "",
  })

  // Load users on component mount
  React.useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  async function addUser() {
    if (!form.id || !form.name || !form.password) {
      toast({ title: "Missing fields", description: "Fill all user fields." })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user")
      }

      toast({ title: "User created", description: `${form.name} (${form.role})` })
      setForm({ id: "", name: "", role: "Student", password: "" })
      await loadUsers() // Reload users list
    } catch (error: any) {
      console.error("Failed to create user:", error)
      toast({ title: "Error", description: error.message || "Failed to create user" })
    } finally {
      setLoading(false)
    }
  }

  async function removeUser(id: string) {
    try {
      const response = await fetch(`/api/users?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      toast({ title: "User removed", description: id })
      await loadUsers() // Reload users list
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      toast({ title: "Error", description: error.message || "Failed to delete user" })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
      <section className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
        <h3 className="text-base font-semibold">Create User</h3>
        <div className="mt-3 grid gap-3 text-sm">
          <label className="grid gap-1">
            <span className="text-muted-foreground">Name</span>
            <input
              className="h-10 rounded-md border border-border/50 bg-background/60 px-3"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-muted-foreground">Role</span>
            <select
              className="h-10 rounded-md border border-border/50 bg-background/60 px-3"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as User["role"] }))}
            >
              <option>Student</option>
              <option>Faculty</option>
              <option>Organizer</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-muted-foreground">ID</span>
            <input
              className="h-10 rounded-md border border-border/50 bg-background/60 px-3"
              value={form.id}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-muted-foreground">Password</span>
            <input
              type="password"
              className="h-10 rounded-md border border-border/50 bg-background/60 px-3"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>
          <button
            onClick={addUser}
            disabled={loading}
            className="mt-2 rounded-md bg-[color:var(--brand-primary)] px-3 py-2 text-sm font-medium text-[color:var(--hero-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
        <h3 className="text-base font-semibold">Users</h3>
        <ul className="mt-3 divide-y divide-border/50 text-sm">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">
                  {u.name} • {u.role}
                </div>
                <div className="text-muted-foreground">ID: {u.id}</div>
              </div>
              <button
                onClick={() => removeUser(u.id)}
                className="inline-flex items-center gap-1 rounded-md border border-border/50 px-2 py-1 text-xs hover:bg-muted/40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
