import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen surface-parchment texture-paper flex items-center justify-center px-4 py-12 md:py-16">
      <div className="w-full max-w-md">
        <header className="text-center mb-10 space-y-2">
          <Link
            href="/"
            className="inline-block font-serif text-3xl tracking-tight text-[hsl(var(--av-night))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--av-gold))] rounded-sm"
          >
            AUMVEDA
          </Link>
          <p className="font-body text-sm text-[hsl(var(--av-mute))]">
            Your healing journey begins here
          </p>
        </header>
        <div className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
