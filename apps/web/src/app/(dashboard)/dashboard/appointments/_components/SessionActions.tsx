'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'

type Props = {
  bookingId: string
  bookingDatetimeIso: string
}

export function SessionActions({ bookingId, bookingDatetimeIso }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const hoursUntil =
    (new Date(bookingDatetimeIso).getTime() - Date.now()) / 3600_000
  const within24h = hoursUntil > 0 && hoursUntil < 24

  async function cancel() {
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not cancel. Please try again.')
        setConfirming(false)
        return
      }
      startTransition(() => {
        router.refresh()
      })
    } catch {
      setError('Could not cancel. Please try again.')
      setConfirming(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/appointments/${bookingId}/reschedule`}
          className="inline-flex h-11 min-h-[44px] items-center justify-center px-5 rounded-full border border-[hsl(var(--av-night))]/20 text-[hsl(var(--av-night))] font-body text-sm font-medium transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
        >
          Reschedule
        </Link>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={pending}
            className="inline-flex h-11 min-h-[44px] items-center justify-center px-5 rounded-full text-[hsl(var(--av-mute))] font-body text-sm underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] disabled:opacity-50"
          >
            Cancel session
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className="inline-flex h-11 min-h-[44px] items-center justify-center px-5 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            >
              {pending ? 'Releasing…' : 'Confirm cancel'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
            >
              Keep session
            </button>
          </div>
        )}
      </div>
      {within24h && (
        <p className="font-body text-xs text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
          Within 24 hours of your session — we still honour your request; reply if you need
          anything else.
        </p>
      )}
      {error && (
        <p className="font-body text-sm text-red-800/80" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
