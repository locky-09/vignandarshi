"use client"

export function SummaryCards({
  totals,
}: {
  totals: { total: number; approved: number; pending: number; rejected: number }
}) {
  const items = [
    { label: "Total Requests", value: totals.total },
    { label: "Approved Bookings", value: totals.approved },
    { label: "Pending Requests", value: totals.pending },
    { label: "Rejected Requests", value: totals.rejected },
  ]
  return (
    <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-border/50 bg-card/60 p-4 text-sm backdrop-blur">
          <div className="text-muted-foreground">{it.label}</div>
          <div className="mt-2 text-2xl font-semibold">{it.value}</div>
        </div>
      ))}
    </section>
  )
}
