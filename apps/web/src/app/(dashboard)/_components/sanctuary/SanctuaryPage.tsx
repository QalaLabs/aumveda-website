import type { ReactNode } from 'react'

interface SanctuaryPageProps {
  children: ReactNode
  /** Max content width — default reading measure */
  narrow?: boolean
  className?: string
}

/** Shared parchment reading column for client sanctuary pages */
export default function SanctuaryPage({
  children,
  narrow = false,
  className = '',
}: SanctuaryPageProps) {
  return (
    <main
      className={`min-h-[calc(100vh-3.5rem)] bg-[hsl(var(--av-parchment))] texture-paper ${className}`}
    >
      <div
        className={`mx-auto px-6 py-10 md:py-14 space-y-12 pb-24 ${
          narrow ? 'max-w-[640px]' : 'max-w-[720px]'
        }`}
      >
        {children}
      </div>
    </main>
  )
}

interface SanctuaryHeaderProps {
  eyebrow?: string
  title: string
  lede?: string
}

export function SanctuaryHeader({ eyebrow, title, lede }: SanctuaryHeaderProps) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] text-balance leading-tight">
        {title}
      </h1>
      {lede ? (
        <p className="font-body text-base text-[hsl(var(--av-mute))] max-w-[52ch] leading-relaxed">
          {lede}
        </p>
      ) : null}
    </header>
  )
}
