import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const serviceId = process.env.EMAILJS_SERVICE_ID
    const templateId = process.env.EMAILJS_TEMPLATE_ID
    const publicKey = process.env.EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      return NextResponse.json(
        { error: "Missing EmailJS env vars. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY." },
        { status: 500 },
      )
    }

    // Map to exact template parameter names shown in your screenshot
    const faculty_name = body.faculty_name ?? body.facultyName ?? body.organizerName ?? "" // organizerName fallback
    const faculty_id = body.faculty_id ?? body.facultyId ?? body.eventName ?? "" // eventName fallback for organizers
    const room_no = body.room_no ?? body.roomNo ?? body.hallName ?? body.hall ?? "" // hallName/hall fallback from organizer flow
    const date = body.date ?? ""
    const time_slot = body.time_slot ?? body.time ?? "" // map time → time_slot
    const purpose = body.purpose ?? body.description ?? ""

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        faculty_name,
        faculty_id,
        room_no,
        date,
        time_slot,
        purpose,
        status: "pending",
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
