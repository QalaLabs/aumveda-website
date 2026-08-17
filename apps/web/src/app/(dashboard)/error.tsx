'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))]">
          This page hit a snag
        </h1>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[40ch] mx-auto">
          Something didn&apos;t load as expected. This is usually temporary — try refreshing or head back to your dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium transition-transform active:scale-[0.97]"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full border border-[hsl(var(--av-stone))] text-[hsl(var(--av-mute))] font-body text-sm font-medium transition-colors hover:bg-[hsl(var(--av-stone)/0.2)]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
