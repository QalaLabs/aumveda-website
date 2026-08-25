'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Participation {
  daysCompleted: number
  completedAt: string | null
}

interface Props {
  id: string
  title: string
  durationDays: number
  profileTargets: string[]
  chakraTargets: string[]
  participation: Participation | null
}

export default function ChallengeCard({
  id,
  title,
  durationDays,
  profileTargets,
  chakraTargets,
  participation,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEnrolled = !!participation
  const isComplete = !!participation?.completedAt
  const daysCompleted = participation?.daysCompleted ?? 0
  const percent = Math.min(100, Math.round((daysCompleted / durationDays) * 100))

  async function handleEnroll() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/community/challenges/${id}/enroll`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to enroll')
      router.refresh()
    } catch {
      setError('Could not enroll. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleCheckIn() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/community/challenges/${id}/check-in`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to check in')
      router.refresh()
    } catch {
      setError('Could not check in. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const tags = [...profileTargets, ...chakraTargets].filter(Boolean)

  return (
    <article className="rounded-3xl border border-[hsl(var(--av-stone))] bg-white/60 p-6 space-y-4">
      <div className="space-y-2">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          {durationDays}-day challenge
        </p>
        <h3 className="font-serif text-xl text-[hsl(var(--av-night))]">{title}</h3>
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--av-stone))] text-[hsl(var(--av-mute))]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {isEnrolled ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-[hsl(var(--av-mute))]">
              Day {daysCompleted} of {durationDays}
            </p>
            <p className="font-mono text-xs tabular text-[hsl(var(--av-mute))]">{percent}%</p>
          </div>
          <div className="h-2 w-full rounded-full bg-[hsl(var(--av-stone))] overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--av-gold))] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? <p className="font-body text-xs text-[hsl(var(--av-rose))]">{error}</p> : null}

      <div>
        {!isEnrolled ? (
          <button
            type="button"
            onClick={handleEnroll}
            disabled={busy}
            className="inline-flex h-10 items-center px-5 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm disabled:opacity-50"
          >
            {busy ? 'Enrolling…' : 'Enroll'}
          </button>
        ) : isComplete ? (
          <span className="inline-flex h-10 items-center px-5 rounded-full bg-[hsl(var(--av-sage)/0.15)] text-[hsl(var(--av-sage))] font-body text-sm">
            Completed
          </span>
        ) : (
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={busy}
            className="inline-flex h-10 items-center px-5 rounded-full border border-[hsl(var(--av-night))] text-[hsl(var(--av-night))] font-body text-sm disabled:opacity-50"
          >
            {busy ? 'Checking in…' : 'Check in today'}
          </button>
        )}
      </div>
    </article>
  )
}
