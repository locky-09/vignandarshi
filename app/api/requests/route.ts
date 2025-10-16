import { NextResponse } from "next/server"
import { appendJsonArray, readJson } from "@/lib/storage"
import { prisma } from "@/lib/prisma"

type AdminRequest = {
  id: string
  room: string
  userId: string
  role: "Student" | "Faculty" | "Organizer"
  date: string
  time: string
  message: string
  status: "pending" | "approved" | "rejected"
  source?: "teacher" | "organiser"
  sourceRef?: number
  email?: string
}

export async function GET() {
  try {
    const rows = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(rows)
  } catch {
    const rows = await readJson<AdminRequest[]>("admin-requests", [])
    return NextResponse.json(rows)
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AdminRequest>
    // Try DB first
    try {
      const created = await prisma.request.create({
        data: {
          id: String(body.id ?? `${Date.now()}`),
          roomId: body.room || "TBD",
          userId: body.userId || "User",
          role: (body.role as any) || "Faculty",
          date: body.date || "",
          time: body.time || "",
          message: body.message || "",
          status: (body.status as any) || "pending",
          source: body.source as any,
          sourceRef: body.sourceRef || null,
          email: body.email,
        },
      })
      return NextResponse.json({ ok: true, id: created.id })
    } catch {}

    const id = String(body.id ?? `${Date.now()}`)
    const row: AdminRequest = {
      id,
      room: body.room || "TBD",
      userId: body.userId || "User",
      role: (body.role as any) || "Faculty",
      date: body.date || "",
      time: body.time || "",
      message: body.message || "",
      status: (body.status as any) || "pending",
      source: body.source,
      sourceRef: body.sourceRef,
      email: body.email,
    }
    const next = await appendJsonArray<AdminRequest>("admin-requests", row)
    return NextResponse.json({ ok: true, id, data: next })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid body" }, { status: 400 })
  }
}


