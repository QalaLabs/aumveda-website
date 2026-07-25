'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'

interface ProgressHistoryPoint {
  date: string
  score: number
  sleep: number
  activity: number
  journal: number
  wellbeing: number
}

interface ProgressData {
  current: number
  average: number
  history: ProgressHistoryPoint[]
  breakdown: { sleep: number; activity: number; journal: number; wellbeing: number }
}

function narrativeFrom(data: ProgressData | null): { k: string; v: string }[] {
  if (!data) {
    return [
      {
        k: 'Beginning',
        v: 'Your transformation story starts with one practice, one reflection, one quiet return.',
      },
    ]
  }

  const { breakdown, current, history } = data
  const lines: { k: string; v: string }[] = []

  if (breakdown.activity >= 60) {
    lines.push({
      k: 'Practice',
      v: 'My practice has become steadier. Showing up feels less like effort and more like belonging.',
    })
  } else if (breakdown.activity >= 30) {
    lines.push({
      k: 'Practice',
      v: 'My consistency is improving. Small returns are rewriting the old pattern of starting and stopping.',
    })
  } else {
    lines.push({
      k: 'Practice',
      v: 'I am learning to return. Even irregular practice still counts as beginning again.',
    })
  }

  if (breakdown.journal >= 50) {
    lines.push({
      k: 'Reflection',
      v: 'My reflections are changing. The page holds more honesty, and less performance.',
    })
  } else if (breakdown.journal > 0) {
    lines.push({
      k: 'Reflection',
      v: 'I am finding words for what used to stay unnamed. Writing is becoming a soft companion.',
    })
  } else {
    lines.push({
      k: 'Reflection',
      v: 'When I am ready, the journal will wait — without pressure to perform insight.',
    })
  }

  if (breakdown.wellbeing >= 60) {
    lines.push({
      k: 'Nervous system',
      v: 'I have become calmer. Softness is showing up in places that used to hold only urgency.',
    })
  } else if (breakdown.wellbeing >= 40) {
    lines.push({
      k: 'Nervous system',
      v: 'Regulation is arriving in waves. Some days tender, some days steadier — both are true.',
    })
  } else {
    lines.push({
      k: 'Nervous system',
      v: 'The body is still learning safety. Softness is allowed to take the time it needs.',
    })
  }

  if (history.length >= 5 && current >= data.average) {
    lines.push({
      k: 'Identity',
      v: 'I am becoming someone who tends to myself. That is the transformation that lasts.',
    })
  } else {
    lines.push({
      k: 'Identity',
      v: 'Healing is not a score. It is the quiet decision to keep returning to this space.',
    })
  }

  return lines
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/profile/progress?range=30d')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d)
      })
      .finally(() => setLoading(false))
  }, [])

  const narratives = narrativeFrom(data)
  const daysHeld = data?.history?.length ?? 0

  return (
    <>
      <Topbar title="Progress" />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper">
        <div className="max-w-[720px] mx-auto px-6 py-10 md:py-14 space-y-14 pb-24">
          <header className="space-y-3">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Transformation
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance">
              Who I am becoming
            </h1>
            <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[50ch] leading-relaxed">
              Not charts. Not KPIs. Evidence of a quieter nervous system and a more honest life.
            </p>
          </header>

          {loading ? (
            <div className="h-40 bg-[hsl(var(--av-stone)/0.35)] animate-pulse rounded-sm" />
          ) : (
            <>
              <p className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))] leading-snug text-balance max-w-[28ch]">
                {daysHeld > 0
                  ? `${daysHeld} day${daysHeld === 1 ? '' : 's'} of showing up — held without spectacle.`
                  : 'Your first days of practice will live here as story, not score.'}
              </p>

              <section className="divide-y divide-[hsl(var(--av-stone))] border-t border-[hsl(var(--av-stone))]">
                {narratives.map((n) => (
                  <article key={n.k} className="py-8 space-y-3">
                    <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]">
                      {n.k}
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] leading-snug text-balance max-w-[36ch]">
                      {n.v}
                    </p>
                  </article>
                ))}
              </section>

              <div className="flex flex-wrap gap-6 pt-2">
                <Link
                  href="/dashboard/dose"
                  className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4"
                >
                  Today&apos;s practice
                </Link>
                <Link
                  href="/dashboard/journal"
                  className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
                >
                  Journal
                </Link>
                <Link
                  href="/dashboard/journey"
                  className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4"
                >
                  My journey
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
