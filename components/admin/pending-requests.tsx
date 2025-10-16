"use client"
import { useToast } from "@/hooks/use-toast"

export type RequestItem = {
  id: string
  room: string
  userId: string
  role: "Student" | "Faculty" | "Organizer"
  date: string
  time: string
  message: string
  status: "pending" | "approved" | "rejected"
  email?: string
}

export function PendingRequests({
  data,
  onChange,
}: {
  data: RequestItem[]
  onChange: (next: RequestItem[]) => void
}) {
  const { toast } = useToast()

  async function sendStatusEmail(item: RequestItem, status: "approved" | "rejected") {
    const to = item.email || "requester@example.com"

    try {
      const cfgRes = await fetch("/api/email/config")
      const cfg = await cfgRes.json().catch(() => ({}) as any)

      if (!cfg?.ok || !cfg?.serviceId || !cfg?.templateId || !cfg?.publicKey) {
        throw new Error(
          "Email service not configured. Add EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY in Vars.",
        )
      }

      const payload = {
        service_id: cfg.serviceId,
        template_id: cfg.templateId,
        user_id: cfg.publicKey,
        template_params: {
          to_email: to,
          status,
          room: item.room,
          user_id: item.userId,
          role: item.role,
          date: item.date,
          time: item.time,
          message: item.message,
          request_id: item.id,
        },
      }

      const ej = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!ej.ok) {
        const txt = await ej.text().catch(() => "")
        throw new Error(txt || "Failed to send email via EmailJS")
      }

      toast({ title: "Email sent", description: `Request ${item.id} ${status}.` })
    } catch (e: any) {
      toast({
        title: "Email failed",
        description:
          e?.message ||
          "Email service not configured. Add EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY in Vars.",
      })
    }
  }

  function updateStatus(id: string, status: "approved" | "rejected") {
    const next = data.map((d) => (d.id === id ? { ...d, status } : d))
    onChange(next)
  }

  async function handle(id: string, status: "approved" | "rejected") {
    const item = data.find((d) => d.id === id)
    if (!item) return
    updateStatus(id, status)
    await sendStatusEmail(item, status)
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {data
        .filter((d) => d.status === "pending")
        .map((d) => (
          <article key={d.id} className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{d.room}</h3>
              <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs text-yellow-600">pending</span>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <dt className="text-muted-foreground">User ID</dt>
                <dd>{d.userId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd>{d.role}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd>{d.date}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Time</dt>
                <dd>{d.time}</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm text-muted-foreground">Reason: {d.message}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handle(d.id, "approved")}
                className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Approve
              </button>
              <button
                onClick={() => handle(d.id, "rejected")}
                className="rounded-md bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-700"
              >
                Reject
              </button>
            </div>
          </article>
        ))}
      {data.filter((d) => d.status === "pending").length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending requests.</p>
      ) : null}
    </div>
  )
}
