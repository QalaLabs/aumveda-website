'use client'

import { useState } from 'react'

interface Props {
  circleId: string
}

export default function CircleRsvpButton({ circleId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleRsvp() {
    setStatus('loading')
    try {
      const res = await fetch('/api/community/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circleId }),
      })
      if (!res.ok) throw new Error('RSVP failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <span className="inline-flex h-9 items-center px-4 rounded-full bg-[hsl(var(--av-sage)/0.15)] text-[hsl(var(--av-sage))] font-body text-sm">
        You&apos;re in
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleRsvp}
      disabled={status === 'loading'}
      className="inline-flex h-9 items-center px-4 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
    >
      {status === 'loading' ? 'RSVPing…' : status === 'error' ? 'Try again' : 'RSVP'}
    </button>
  )
}
