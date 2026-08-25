'use client'

import { useState } from 'react'

type Props =
  | { kind: 'remaining'; sessionsRemaining: number; sessionsTotal: number; packageLabel: string }
  | { kind: 'offer'; completedSessions: number }

const OFFERS: { packageType: '3_session' | '6_session'; label: string; blurb: string }[] = [
  { packageType: '3_session', label: '3-session package', blurb: 'Continue at a gentle, steady pace.' },
  { packageType: '6_session', label: '6-session package', blurb: 'Deeper, sustained support over time.' },
]

export default function PackageStatusCard(props: Props) {
  const [requested, setRequested] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (props.kind === 'remaining') {
    const { sessionsRemaining, sessionsTotal, packageLabel } = props
    const pct = sessionsTotal > 0 ? Math.round(((sessionsTotal - sessionsRemaining) / sessionsTotal) * 100) : 0
    return (
      <section className="border-t border-[hsl(var(--av-stone))] pt-6 pb-2 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-body text-sm text-[hsl(var(--av-mute))]">
            {packageLabel.replace(/_/g, ' ')}
          </p>
          <p className="font-serif text-lg text-[hsl(var(--av-night))]">
            {sessionsRemaining} session{sessionsRemaining === 1 ? '' : 's'} remaining
          </p>
        </div>
        <div className="h-1.5 rounded-full bg-[hsl(var(--av-stone))] overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--av-gold))]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </section>
    )
  }

  async function requestUpgrade(packageType: '3_session' | '6_session') {
    setPending(true)
    try {
      const res = await fetch('/api/packages/upgrade-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      })
      if (res.ok) setRequested(packageType)
    } catch {
      // silent — non-critical, no error state needed for a soft offer
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="border-t border-[hsl(var(--av-stone))] pt-8 space-y-5">
      <div className="space-y-1.5">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Continue your journey
        </p>
        <h2 className="font-serif text-2xl text-[hsl(var(--av-night))] text-balance">
          Ready for more support?
        </h2>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] max-w-[50ch] leading-relaxed">
          You have completed {props.completedSessions} session{props.completedSessions === 1 ? '' : 's'}.
          Choose a package to keep the momentum with Archana or Sejal.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {OFFERS.map((offer) => {
          const isRequested = requested === offer.packageType
          return (
            <div
              key={offer.packageType}
              className="rounded-2xl border border-[hsl(var(--av-stone))] p-5 space-y-3"
            >
              <p className="font-serif text-lg text-[hsl(var(--av-night))]">{offer.label}</p>
              <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
                {offer.blurb}
              </p>
              <button
                type="button"
                onClick={() => requestUpgrade(offer.packageType)}
                disabled={pending || isRequested}
                className="inline-flex h-10 min-h-[44px] items-center justify-center px-5 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium disabled:opacity-60 transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
              >
                {isRequested ? 'Practitioner notified' : pending ? 'Sending…' : 'I’m interested'}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
