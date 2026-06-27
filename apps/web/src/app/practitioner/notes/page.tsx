'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send } from 'lucide-react'

interface ClientOption {
  id: string
  name: string
}

const PRACTITIONER_OPTIONS = ['sejal', 'archana'] as const

const SERVICE_TYPES = [
  'discovery_call', 'astrology_reading', 'vastu_home', 'vastu_office',
  'healing_session', 'somatic', 'trauma_release',
] as const

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="text-white/40 text-center py-20">Loading...</div>}>
      <NotesForm />
    </Suspense>
  )
}

function NotesForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedUserId = searchParams.get('userId') || ''

  const [userId, setUserId] = useState(preselectedUserId)
  const [practitioner, setPractitioner] = useState('sejal')
  const [serviceType, setServiceType] = useState('healing_session')
  const [keyThemes, setKeyThemes] = useState('')
  const [practicesAssigned, setPracticesAssigned] = useState('')
  const [nextFocus, setNextFocus] = useState('')
  const [distressFlag, setDistressFlag] = useState(false)
  const [saving, setSaving] = useState(false)

  const [clients, setClients] = useState<ClientOption[]>([])

  useEffect(() => {
    fetch('/api/practitioner/clients')
      .then(r => r.json())
      .then(d => setClients(d.data ?? []))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    try {
      const resp = await fetch('/api/practitioner/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          practitioner,
          serviceType,
          keyThemes: keyThemes.split(',').map(s => s.trim()).filter(Boolean),
          practicesAssigned: practicesAssigned.split(',').map(s => s.trim()).filter(Boolean),
          nextSessionRecommendation: nextFocus,
          distressFlag,
        }),
      })
      if (resp.ok) {
        setKeyThemes(''); setPracticesAssigned(''); setNextFocus(''); setDistressFlag(false)
        router.push('/practitioner')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif text-white font-bold mb-8">Session Notes</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Client</label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              <option value="">Select client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Practitioner</label>
            <select
              value={practitioner}
              onChange={e => setPractitioner(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              {PRACTITIONER_OPTIONS.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Service Type</label>
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
          >
            {SERVICE_TYPES.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
            Key Themes <span className="text-white/20 normal-case">(comma-separated)</span>
          </label>
          <textarea
            value={keyThemes}
            onChange={e => setKeyThemes(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder:text-white/20"
            placeholder="e.g. childhood wound, career anxiety, relationship pattern"
          />
        </div>

        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">
            Practices Assigned <span className="text-white/20 normal-case">(comma-separated)</span>
          </label>
          <textarea
            value={practicesAssigned}
            onChange={e => setPracticesAssigned(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder:text-white/20"
            placeholder="e.g. breathwork AM, journaling, somatic shake"
          />
        </div>

        <div>
          <label className="text-white/40 text-xs uppercase tracking-widest block mb-2">Next Session Focus</label>
          <textarea
            value={nextFocus}
            onChange={e => setNextFocus(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder:text-white/20"
            placeholder="What to focus on in the next session"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={distressFlag}
            onChange={e => setDistressFlag(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#C9A84C]"
          />
          <span className="text-white/60 text-sm">⚠ Flag this client as distressed</span>
        </label>

        <button
          type="submit"
          disabled={saving || !userId}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C9A84C] text-[#1A0F3C] font-semibold text-sm hover:bg-[#d4b85a] transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Saving...' : 'Submit Notes'}
        </button>
      </form>
    </div>
  )
}
