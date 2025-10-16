import { NextResponse } from "next/server"
import { readJson } from "@/lib/storage"

type User = { id: string; name: string; role: "Student" | "Faculty" | "Organizer"; password: string }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<User>
    const id = String(body.id || "")
    const password = String(body.password || "")
    if (!id || !password) return NextResponse.json({ error: "Missing id or password" }, { status: 400 })

    const users = await readJson<User[]>("users", [])
    const user = users.find((u) => u.id === id && u.password === password)
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const { password: _pw, ...safe } = user
    return NextResponse.json({ ok: true, user: safe })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid body" }, { status: 400 })
  }
}


