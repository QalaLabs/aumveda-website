import Link from 'next/link'

interface Props {
  dose: { id: number; title: string; durationSec: number; promptText: string }
}

/** Hero practice card — answers "What is my practice today?" */
export default function TodayDoseCard({ dose }: Props) {
  const mins = Math.max(1, Math.round(dose.durationSec / 60))

  return (
    <article className="relative overflow-hidden rounded-2xl bg-[hsl(var(--av-night))] text-[hsl(var(--av-parchment))]">
      <div className="absolute inset-0 texture-paper opacity-30 pointer-events-none" aria-hidden />
      <div className="relative p-8 md:p-10 space-y-8">
        <div className="space-y-3">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
            Today&apos;s practice
          </p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight text-balance">
            {dose.title}
          </h2>
          <p className="font-body text-base text-[hsl(var(--av-parchment)/0.72)] leading-relaxed max-w-[55ch]">
            {dose.promptText}
          </p>
          <p className="font-mono text-sm tabular text-[hsl(var(--av-gold-soft))]">
            {mins} min
          </p>
        </div>

        <Link
          href="/dashboard/dose"
          className="inline-flex h-12 md:h-14 items-center justify-center px-8 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium text-base transition-transform duration-100 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold-soft))]"
        >
          Begin practice
        </Link>
      </div>
    </article>
  )
}
