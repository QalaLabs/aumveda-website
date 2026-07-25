import Link from 'next/link'

interface CosmicNoteProps {
  note: { title: string; body: string; weekOf: Date | string } | null
}

/** Weekly cosmic guidance — top of dashboard */
export default function CosmicNoteCard({ note }: CosmicNoteProps) {
  if (!note) return null

  const weekLabel = new Date(note.weekOf).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[hsl(var(--av-gold)/0.35)] bg-[hsl(var(--av-night))] text-[hsl(var(--av-parchment))]">
      <div className="absolute inset-0 texture-paper opacity-25 pointer-events-none" aria-hidden />
      <div className="relative p-7 md:p-9 space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
            Cosmic note
          </p>
          <p className="font-mono text-xs tabular text-[hsl(var(--av-gold-soft)/0.8)]">
            Week of {weekLabel}
          </p>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl leading-tight text-balance text-[hsl(var(--av-gold-soft))]">
          {note.title}
        </h2>
        <p className="font-body text-base text-[hsl(var(--av-parchment)/0.78)] leading-relaxed max-w-[52ch]">
          {note.body}
        </p>
      </div>
    </article>
  )
}

interface StreakSummaryProps {
  streakDays: number
  checkInDone: boolean
  progress: number
}

export function StreakSummary({ streakDays, checkInDone, progress }: StreakSummaryProps) {
  return (
    <section className="rounded-2xl border border-[hsl(var(--av-stone))] bg-[hsl(40_40%_97%)] p-6 md:p-7 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-mute))]">
            Today&apos;s check-in
          </p>
          <p className="font-serif text-xl text-[hsl(var(--av-night))] mt-1">
            {checkInDone ? 'Held for today' : 'A few quiet minutes'}
          </p>
        </div>
        <Link
          href="/dashboard/check-in"
          className="inline-flex h-11 min-h-[44px] items-center justify-center px-6 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body text-sm font-medium"
        >
          {checkInDone ? 'Revisit' : 'Begin check-in'}
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 pt-1 border-t border-[hsl(var(--av-stone))]">
        <p className="font-body text-sm text-[hsl(var(--av-night))] tabular pt-3">
          <span className="text-[hsl(var(--av-mute))]">Streak · </span>
          {streakDays} day{streakDays === 1 ? '' : 's'}
        </p>
        <p className="font-body text-sm text-[hsl(var(--av-night))] tabular pt-3">
          <span className="text-[hsl(var(--av-mute))]">Completion · </span>
          {Math.round(progress)}%
        </p>
        <Link
          href="/dashboard/progress"
          className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4 pt-3 ml-auto"
        >
          See badges
        </Link>
      </div>
    </section>
  )
}
