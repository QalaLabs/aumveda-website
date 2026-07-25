import Link from 'next/link'

interface Props {
  dose: { id: number; title: string; durationSec: number; promptText: string }
}

/** Hero practice — answers "What is my practice today?" */
export default function TodayDoseCard({ dose }: Props) {
  const mins = Math.max(1, Math.round(dose.durationSec / 60))

  return (
    <article className="space-y-8 border-t border-[hsl(var(--av-stone))] pt-12">
      <div className="space-y-4">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Today&apos;s practice
        </p>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] text-balance text-[hsl(var(--av-night))] max-w-[16ch]">
          {dose.title}
        </h2>
        <p className="font-body text-base md:text-lg text-[hsl(var(--av-mute))] leading-relaxed max-w-[48ch]">
          {dose.promptText}
        </p>
        <p className="font-mono text-sm tabular text-[hsl(var(--av-mute))]">{mins} minutes</p>
      </div>

      <Link
        href="/dashboard/dose"
        className="inline-flex h-14 items-center justify-center px-10 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body font-medium text-base transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
      >
        Begin practice
      </Link>
    </article>
  )
}
