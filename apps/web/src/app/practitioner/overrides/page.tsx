'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface ClientOption {
  id: string
  name: string
}

const PRACTICE_TYPES = [
  'somatic', 'breathwork', 'meditation', 'journaling', 'affirmation', 'vedic_insight', 'pranayama',
] as const

export default function OverridesPage() {
  const [clients, setClients] = useState<ClientOption[]>([])
  const [userId, setUserId] = useState('')
  const [practiceType, setPracticeType] = useState('somatic')
  const [instruction, setInstruction] = useState('')
  const [durationDays, setDurationDays] = useState(7)
  const [saving, setSaving] = useState(false)

  const [overrides, setOverrides] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/practitioner/clients')
      .then(r => r.json())
      .then(d => setClients(d.data ?? []))
      .catch(() => {})
    fetch('/api/practitioner/overrides')
      .then(r => r.json())
      .then(d => setOverrides(d.data ?? []))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !instruction) return
    setSaving(true)
    try {
      const resp = await fetch('/api/practitioner/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, practiceType, instructionText: instruction, durationDays }),
      })
      if (resp.ok) {
        setUserId(''); setInstruction(''); setPracticeType('somatic'); setDurationDays(7)
        const updated = await fetch('/api/practitioner/overrides').then(r => r.json())
        setOverrides(updated.data ?? [])
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-serif text-white font-bold mb-8">Daily Dose Overrides</h1>

      <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-10 space-y-4">
        <h2 className="text-white font-semibold mb-4">New Override</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
          >
            <option value="">Select client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name || c.id}</option>)}
          </select>
          <select
            value={practiceType}
            onChange={e => setPracticeType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
          >
            {PRACTICE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <textarea
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          rows={2}
          placeholder="Override instruction text..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-white/40 text-xs">Duration (days):</label>
            <input
              type="number"
              value={durationDays}
              onChange={e => setDurationDays(Number(e.target.value))}
              min={1}
              max={90}
              className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !userId}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] text-[#1A0F3C] font-semibold text-sm disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Set Override
          </button>
        </div>
      </form>

      <section>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Active Overrides</h2>
        <div className="space-y-2">
          {overrides.map((o: any) => (
            <div key={o.id} className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{o.practiceType} · {o.durationDays}d</p>
                <p className="text-white/30 text-xs mt-1">{o.instructionText?.slice(0, 100)}</p>
              </div>
              <span className="text-xs text-white/30">{o.userId?.slice(0, 8)}</span>
            </div>
          ))}
          {overrides.length === 0 && <p className="text-white/20 text-center py-10">No active overrides.</p>}
        </div>
      </section>
    </div>
  )
}
