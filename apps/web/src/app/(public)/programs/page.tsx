import Link from "next/link";

/**
 * Programs — editorial restraint. Name the need; skip sales theatre.
 * One primary CTA → /step-1. See DESIGN.md.
 */

const PROGRAMS = [
  {
    title: "Unwind & Rewind",
    duration: "21 days",
    forWhom: "Burnout, decision fatigue, a nervous system that will not stand down.",
    approach:
      "Sound and breath to down-regulate stress, with daily ritual that restores rest without forcing productivity.",
  },
  {
    title: "Quit Smoking",
    duration: "30 days",
    forWhom: "A habit that outlived its usefulness — craving loops and identity still fused.",
    approach:
      "Hypnosis and subconscious rewiring paired with gentle detox support, so cessation becomes who you are, not what you resist.",
  },
  {
    title: "Get Over a Breakup",
    duration: "14 days",
    forWhom: "Rumination, heart-ache, a self still defined by who left.",
    approach:
      "CBT to interrupt the loop, somatic release for what the body still holds, and a clear close so the future can open.",
  },
  {
    title: "Sleep",
    duration: "10 days",
    forWhom: "Tired but wired — nights that never quite arrive.",
    approach:
      "Vastu for the sleeping room, breath for the evening mind, and a rhythm that invites deep rest without dependence.",
  },
] as const;

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
      <main>
        <section className="border-b border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))] mb-6">
              Programs
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-[hsl(var(--av-night))] leading-[1.1] max-w-[14ch]">
              Time-bound paths for a clear need.
            </h1>
            <p className="mt-8 font-body text-lg text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              Four focused journeys. Clinical care and Vedic craft, held together —
              not stacked as features. If none fit, begin the open journey and we will
              listen first.
            </p>
          </div>
        </section>

        <section aria-labelledby="programs-list-heading">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <h2 id="programs-list-heading" className="sr-only">
              Program list
            </h2>
            <ul className="divide-y divide-[hsl(var(--av-stone))]">
              {PROGRAMS.map((program) => (
                <li key={program.title} className="py-10 md:py-12 first:pt-0 last:pb-0 space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-night))]">
                      {program.title}
                    </h3>
                    <span className="font-mono text-sm tabular-nums text-[hsl(var(--av-mute))]">
                      {program.duration}
                    </span>
                  </div>
                  <p className="font-body text-base text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[60ch]">
                    {program.forWhom}
                  </p>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed max-w-[60ch]">
                    {program.approach}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
            <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] max-w-[30ch]">
              Your practice begins with a breath — not a package.
            </p>
            <Link
              href="/step-1"
              className="inline-flex h-12 md:h-14 min-h-[44px] items-center justify-center px-8 md:px-10 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body font-medium text-base transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/services"
              className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:text-[hsl(var(--av-night))] hover:decoration-[hsl(var(--av-gold))] transition-colors"
            >
              Browse by concern
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
