import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const {
      to_email,
      status,
      room,
      user_id,
      role,
      date,
      time,
      message,
    }: {
      to_email: string
      status: "approved" | "rejected"
      room: string
      user_id: string
      role: string
      date: string
      time: string
      message: string
    } = await req.json()

    const serviceId = process.env.EMAILJS_SERVICE_ID
    const templateId = process.env.EMAILJS_TEMPLATE_ID
    const publicKey = process.env.EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json(
        { error: "Missing EmailJS env vars. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY." },
        { status: 500 },
      )
    }

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email,
        status,
        room,
        user_id,
        role,
        date,
        time,
        message,
      },
    }

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt || "EmailJS send failed" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}
