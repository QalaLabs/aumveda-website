import Image from 'next/image'
import Link from 'next/link'

interface CosmicNoteProps {
  note: { title: string; body: string; weekOf: Date | string } | null
}

/** Weekly cosmic guidance — editorial band, not a SaaS card */
export default function CosmicNoteCard({ note }: CosmicNoteProps) {
  if (!note) return null

  const weekLabel = new Date(note.weekOf).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
  })

  return (
    <article className="space-y-8">
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm">
        <Image
          src="/marketing/founders.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-parchment))] via-[hsl(var(--av-parchment)/0.35)] to-transparent"
          aria-hidden
        />
      </div>

      <div className="space-y-4 -mt-16 relative">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
            This week&apos;s cosmic weather
          </p>
          <p className="font-mono text-xs tabular text-[hsl(var(--av-mute))]">
            Week of {weekLabel}
          </p>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-balance text-[hsl(var(--av-night))] max-w-[18ch]">
          {note.title}
        </h2>
        <p className="font-body text-lg text-[hsl(var(--av-mute))] leading-relaxed max-w-[42ch]">
          {note.body}
        </p>
      </div>
    </article>
  )
}

interface QuietGroundingProps {
  checkInDone: boolean
}

/** Soft grounding line — not KPI */
export function QuietGrounding({ checkInDone }: QuietGroundingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2">
      <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[40ch]">
        {checkInDone
          ? 'You have already checked in today. Return whenever you need grounding.'
          : 'A few quiet minutes to arrive in your body before practice.'}
      </p>
      <Link
        href="/dashboard/check-in"
        className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] shrink-0"
      >
        {checkInDone ? 'Revisit check-in' : 'Begin check-in'}
      </Link>
    </div>
  )
}
