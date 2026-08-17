'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[hsl(var(--av-parchment))] flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="font-serif text-2xl text-[hsl(var(--av-night))]">
          Something went wrong
        </h1>
        <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
          An unexpected error occurred. Please try again — if it persists, the stars may need a moment to realign.
        </p>
        <button
          onClick={reset}
          className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium transition-transform active:scale-[0.97]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
