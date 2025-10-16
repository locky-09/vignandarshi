import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  cookies().set("lsbms_token", "", { httpOnly: true, maxAge: 0, path: "/" })
  return NextResponse.json({ ok: true })
}


