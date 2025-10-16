import { NextResponse } from "next/server"
import { readJson, writeJson } from "@/lib/storage"
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    const body = (await req.json()) as Partial<AdminRequest>
    try {
      await prisma.request.update({
        where: { id },
        data: {
          status: (body.status as any) || undefined,
          message: body.message || undefined,
          time: body.time || undefined,
          date: body.date || undefined,
          email: body.email || undefined,
        },
      })
      return NextResponse.json({ ok: true })
    } catch {}

    const rows = await readJson<AdminRequest[]>("admin-requests", [])
    const next = rows.map((r) => (r.id === id ? { ...r, ...body, id } : r))
    await writeJson("admin-requests", next)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid body" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = params.id
  try {
    await prisma.request.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {}
  const rows = await readJson<AdminRequest[]>("admin-requests", [])
  const next = rows.filter((r) => r.id !== id)
  await writeJson("admin-requests", next)
  return NextResponse.json({ ok: true })
}


