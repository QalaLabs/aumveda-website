'use client'

import { useState, useEffect } from 'react'
import { IndianRupee, Calendar, Users, TrendingUp } from 'lucide-react'

interface RevenueData {
  sessionsBookedThisMonth: number
  bookingRevenue: number
  packageRevenue: number
  packagesSoldThisMonth: number
  communityMrr: number
  activeSubscriptions: number
  totalRevenueThisMonth: number
  bookingsByPractitioner: { practitioner: string; sessionsBooked: number }[]
}

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof IndianRupee
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
      <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mb-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-2xl font-serif text-white font-bold">{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function PractitionerRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/practitioner/revenue')
      .then((r) => r.json())
      .then((d) => setData(d.data ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white font-bold">Revenue Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">{monthLabel} · read-only aggregate view</p>
      </div>

      {loading ? (
        <p className="text-white/20 text-center py-20">Loading…</p>
      ) : !data ? (
        <p className="text-white/20 text-center py-20">No revenue data available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              icon={Calendar}
              label="Sessions Booked"
              value={String(data.sessionsBookedThisMonth)}
              sub="this month"
            />
            <MetricCard
              icon={IndianRupee}
              label="Package Revenue"
              value={formatInr(data.packageRevenue)}
              sub={`${data.packagesSoldThisMonth} packages sold`}
            />
            <MetricCard
              icon={TrendingUp}
              label="Community MRR"
              value={formatInr(data.communityMrr)}
              sub={`${data.activeSubscriptions} active subscriptions`}
            />
            <MetricCard
              icon={IndianRupee}
              label="Total Revenue"
              value={formatInr(data.totalRevenueThisMonth)}
              sub="bookings + packages, this month"
            />
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Sessions by Practitioner
            </h2>
            <div className="space-y-2">
              {data.bookingsByPractitioner.length === 0 ? (
                <p className="text-white/20 text-sm py-6 text-center">No bookings this month yet.</p>
              ) : (
                data.bookingsByPractitioner.map((row) => (
                  <div
                    key={row.practitioner}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-white/70 text-sm capitalize">{row.practitioner}</span>
                    <span className="text-white font-medium text-sm">{row.sessionsBooked} sessions</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
