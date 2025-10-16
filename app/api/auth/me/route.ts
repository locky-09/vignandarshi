import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me"

export async function GET() {
  const token = cookies().get("lsbms_token")?.value
  if (!token) return NextResponse.json({ user: null })
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findUnique({ where: { id: payload.sub as string } })
    if (!user) return NextResponse.json({ user: null })
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch {
    return NextResponse.json({ user: null })
  }
}


