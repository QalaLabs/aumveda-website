'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, AlertCircle } from 'lucide-react'

interface ClientSummary {
  id: string
  name: string
  email: string
  profileResult: string
  lastSessionDate: string | null
  sessionsRemaining: number
  currentDoseTheme: string | null
  distressFlag: boolean
}

export default function PractitionerPage() {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<ClientSummary[]>([])

  useEffect(() => {
    fetch('/api/practitioner/clients')
      .then(r => r.json())
      .then(d => setClients(d.data ?? []))
      .catch(() => {})
  }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-white font-bold">Clients</h1>
          <p className="text-white/30 text-sm mt-1">{clients.length} active</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/50 w-64"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <Link
            key={c.id}
            href={`/practitioner/notes?userId=${c.id}`}
            className="block bg-white/5 hover:bg-white/10 rounded-2xl p-5 transition-all border border-white/5 hover:border-[#C9A84C]/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold text-sm">
                  {c.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">
                    {c.name || 'Unnamed'}
                    {c.distressFlag && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                  </p>
                  <p className="text-white/30 text-xs">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <div className="text-right">
                  <p className="text-white/40">Profile</p>
                  <p className="text-[#C9A84C] font-medium">{c.profileResult?.replace(/_/g, ' ') || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40">Sessions Left</p>
                  <p className="text-white font-medium">{c.sessionsRemaining}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40">Last Session</p>
                  <p className="text-white/60">{c.lastSessionDate ? new Date(c.lastSessionDate).toLocaleDateString() : '—'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20" />
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-white/20 text-center py-20">No clients found.</p>
        )}
      </div>
    </div>
  )
}
