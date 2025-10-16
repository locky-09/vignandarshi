import { NextResponse } from "next/server"

export async function GET() {
  // We only return public identifiers; EmailJS is designed to be called from the browser.
  const serviceId = process.env.EMAILJS_SERVICE_ID || ""
  const templateId = process.env.EMAILJS_TEMPLATE_ID || ""
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || ""

  return NextResponse.json({
    serviceId,
    templateId,
    publicKey,
    ok: Boolean(serviceId && templateId && publicKey),
  })
}
