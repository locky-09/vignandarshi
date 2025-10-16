"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, YAxis, Legend } from "recharts"

type ChartDatum = { name: string; value: number }
export function Reports({
  byRole,
}: {
  byRole: ChartDatum[]
}) {
  const ROLE_COLORS: Record<string, string> = {
    Student: "#3B82F6", // blue
    Faculty: "#10B981", // emerald
    Organizer: "#F59E0B", // amber
  }
  const roleColor = (name: string) => ROLE_COLORS[name] ?? "#6B7280"
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
        <h3 className="mb-2 text-base font-semibold">Bookings by Role</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="value" data={byRole} outerRadius={80} label>
                {byRole.map((d, i) => (
                  <Cell key={i} fill={roleColor(d.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur">
        <h3 className="mb-2 text-base font-semibold">Requests by Role</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byRole}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {byRole.map((d, i) => (
                  <Cell key={i} fill={roleColor(d.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
