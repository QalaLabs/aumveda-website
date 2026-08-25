'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface DistressAlert {
  id: string
  name: string
  email: string
  completedCount: number
  expectedCount: number
  completionRate: number
}

export default function DistressAlertsPage() {
  const [alerts, setAlerts] = useState<DistressAlert[]>([])
  const [windowDays, setWindowDays] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/practitioner/distress-alerts')
      .then((r) => r.json())
      .then((d) => {
        setAlerts(d.data?.alerts ?? [])
        setWindowDays(d.data?.windowDays ?? 5)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-white font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Distress Alerts
        </h1>
        <p className="text-white/30 text-sm mt-1">
          Clients whose daily-dose completion fell below 30% over the last {windowDays} days
        </p>
      </div>

      {loading ? (
        <p className="text-white/20 text-center py-20">Loading…</p>
      ) : alerts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-white/30">No clients below threshold right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Link
              key={a.id}
              href={`/practitioner/notes?userId=${a.id}`}
              className="block bg-red-500/5 hover:bg-red-500/10 rounded-2xl p-5 border border-red-500/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{a.name}</p>
                    <p className="text-white/30 text-xs">{a.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-medium text-sm">
                    {Math.round(a.completionRate * 100)}% completion
                  </p>
                  <p className="text-white/30 text-xs">
                    {a.completedCount} / {a.expectedCount} doses
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
