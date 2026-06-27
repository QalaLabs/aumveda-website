'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Video } from 'lucide-react'

interface Session {
  id: string
  clientName: string
  bookingDatetime: string
  serviceType: string
  zoomLink: string | null
  status: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    fetch('/api/practitioner/sessions')
      .then(r => r.json())
      .then(d => setSessions(d.data ?? []))
      .catch(() => {})
  }, [])

  const upcoming = sessions.filter(s => s.status === 'confirmed' || s.status === 'pending')
  const past = sessions.filter(s => s.status === 'completed')

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-serif text-white font-bold mb-8">Sessions</h1>

      <section className="mb-10">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Upcoming</h2>
        <div className="space-y-3">
          {upcoming.map(s => (
            <div key={s.id} className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-white font-semibold">{s.clientName}</p>
                  <div className="flex items-center gap-4 text-xs text-white/40 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.bookingDatetime).toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.serviceType}</span>
                  </div>
                </div>
              </div>
              {s.zoomLink && (
                <a href={s.zoomLink} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C]/10 text-[#C9A84C] text-sm hover:bg-[#C9A84C]/20 transition-all">
                  <Video className="w-3.5 h-3.5" /> Join
                </a>
              )}
            </div>
          ))}
          {upcoming.length === 0 && <p className="text-white/20 text-center py-10">No upcoming sessions.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Past Sessions</h2>
        <div className="space-y-2">
          {past.map(s => (
            <div key={s.id} className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{s.clientName}</p>
                <p className="text-white/30 text-xs">{new Date(s.bookingDatetime).toLocaleDateString()}</p>
              </div>
              <span className="text-xs text-white/30">{s.serviceType}</span>
            </div>
          ))}
          {past.length === 0 && <p className="text-white/20 text-center py-10">No past sessions.</p>}
        </div>
      </section>
    </div>
  )
}
