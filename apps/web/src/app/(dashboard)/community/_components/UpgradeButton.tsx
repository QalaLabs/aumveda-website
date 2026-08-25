'use client'

import { useState } from 'react'

export default function UpgradeButton() {
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleUpgrade() {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/community/upgrade', { method: 'POST' })
      const data = await res.json().catch(() => null)
      setMessage(data?.message || 'Upgrades are coming soon.')
    } catch {
      setMessage('Something went wrong. Try again shortly.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={busy}
        className="inline-flex h-11 items-center px-6 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-sm font-medium disabled:opacity-50"
      >
        {busy ? 'Please wait…' : 'Upgrade membership'}
      </button>
      {message ? <p className="font-body text-xs text-[hsl(var(--av-mute))]">{message}</p> : null}
    </div>
  )
}
