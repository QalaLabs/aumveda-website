'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { CalendarSelector } from '@/portal/steps/Step8Booking/CalendarSelector'

type Props = {
  bookingId: string
  practitionerLabel: string
  currentIso: string
  durationMinutes: number
}

export function RescheduleForm({
  bookingId,
  practitionerLabel,
  currentIso,
  durationMinutes,
}: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [datetime, setDatetime] = useState('')
  const [error, setError] = useState<string | null>(null)

  const hoursUntil = (new Date(currentIso).getTime() - Date.now()) / 3600_000
  const isPast = hoursUntil <= 0
  const within24h = hoursUntil > 0 && hoursUntil < 24

  const currentLabel = new Date(currentIso).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  })

  async function submit() {
    if (!datetime) {
      setError('Please choose a new time.')
      return
    }
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingDatetime: datetime }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not reschedule. Please try again.')
        return
      }
      startTransition(() => {
        router.push(`/dashboard/appointments/confirmed?bookingId=${bookingId}`)
        router.refresh()
      })
    } catch {
      setError('Could not reschedule. Please try again.')
    }
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2 border-b border-[hsl(var(--av-stone))] pb-8">
        <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
          Current time · IST
        </p>
        <p className="font-serif text-xl text-[hsl(var(--av-night))]">{currentLabel}</p>
        <p className="font-body text-sm text-[hsl(var(--av-mute))]">With {practitionerLabel}</p>
      </div>

      <div
        className={`rounded-2xl border p-4 space-y-1 ${
          isPast || within24h
            ? 'border-amber-800/20 bg-amber-50/60'
            : 'border-[hsl(var(--av-stone))] bg-[hsl(var(--av-stone))]/20'
        }`}
        role="note"
      >
        <p className="font-body text-sm font-medium text-[hsl(var(--av-night))]">
          {isPast
            ? 'This session time has passed'
            : within24h
              ? 'Within 24 hours — reschedule may be forfeited'
              : 'Free reschedule'}
        </p>
        <p className="font-body text-xs text-[hsl(var(--av-mute))] leading-relaxed">
          {isPast
            ? 'This appointment is already past its scheduled time and was inside the 24-hour cutoff, so it is considered forfeited under our policy — we still honour your request when we can, so let us know if anything comes up.'
            : within24h
              ? 'You are inside the 24-hour window for this session. Our policy is that reschedules within 24 hours are forfeited — we still honour your request when we can, so let us know if anything comes up.'
              : 'You can reschedule free of charge any time up to 24 hours before your session. Inside that window, the session is considered forfeited.'}
        </p>
      </div>

      <CalendarSelector
        onChange={setDatetime}
        practitionerName={practitionerLabel}
        durationMinutes={durationMinutes}
      />

      {error && (
        <p className="font-body text-sm text-red-800/80" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={pending || !datetime}
          className="inline-flex h-12 min-h-[44px] items-center justify-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body text-base font-medium disabled:opacity-50 transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]"
        >
          {pending ? 'Saving…' : 'Confirm new time'}
        </button>
        <Link
          href="/dashboard/appointments"
          className="inline-flex h-12 min-h-[44px] items-center justify-center px-6 font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
        >
          Back to Sessions
        </Link>
      </div>
    </div>
  )
}
