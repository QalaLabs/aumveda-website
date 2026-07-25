import Link from "next/link";

/**
 * Services — concern-led, calm list. Not a feature dump.
 * One primary CTA → /step-1. See DESIGN.md.
 */

const CONCERNS = [
  {
    concern: "Thoughts that will not quiet",
    modalities: "CBT · talk therapy · hypnosis",
    heldBy: "Sejal",
  },
  {
    concern: "A body stuck in stress",
    modalities: "Breathwork · sound therapy · bioresonance",
    heldBy: "Sejal",
  },
  {
    concern: "Healing that fades between sessions",
    modalities: "Behavior dosing — small daily protocols",
    heldBy: "Sejal",
  },
  {
    concern: "Timing, purpose, and karmic pattern",
    modalities: "Vedic & Western astrology",
    heldBy: "Archana",
  },
  {
    concern: "A home or workspace that feels against you",
    modalities: "Vastu — residential and commercial",
    heldBy: "Archana",
  },
  {
    concern: "Clarity at a crossroads",
    modalities: "Tarot · angel cards · crystallomancy",
    heldBy: "Archana",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
      <main>
        <section className="border-b border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))] mb-6">
              Services
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-[hsl(var(--av-night))] leading-[1.1] max-w-[16ch]">
              What brings you here?
            </h1>
            <p className="mt-8 font-body text-lg text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              Archana maps the outer architecture — astrology, Vastu, ritual.
              Sejal tends the inner system — CBT, breath, sound, subconscious work.
              You do not choose a modality first. You name what hurts.
            </p>
          </div>
        </section>

        <section aria-labelledby="concerns-heading">
          <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
            <h2 id="concerns-heading" className="sr-only">
              Concerns we hold
            </h2>
            <ul className="divide-y divide-[hsl(var(--av-stone))]">
              {CONCERNS.map((item) => (
                <li key={item.concern} className="py-8 md:py-10 first:pt-0 last:pb-0">
                  <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] leading-snug">
                    {item.concern}
                  </p>
                  <p className="mt-3 font-body text-sm text-[hsl(var(--av-mute))] leading-relaxed">
                    {item.modalities}
                    <span className="text-[hsl(var(--av-stone))] mx-2" aria-hidden>
                      ·
                    </span>
                    <span className="text-[hsl(var(--av-ink-text))]">{item.heldBy}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="space-y-3">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Archana · Jaipur
              </p>
              <p className="font-body text-base text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[40ch]">
                Astrology · Tarot · Vastu · Crystallomancy
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Sejal · Mumbai
              </p>
              <p className="font-body text-base text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[40ch]">
                CBT · Hypnosis · Sound · Breathwork · Talk therapy · Bioresonance ·
                Behavior dosing
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
            <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))] max-w-[28ch]">
              Not sure where to begin? Start with the journey — we will meet you there.
            </p>
            <Link
              href="/step-1"
              className="inline-flex h-12 md:h-14 min-h-[44px] items-center justify-center px-8 md:px-10 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body font-medium text-base transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/programs"
              className="font-body text-sm text-[hsl(var(--av-mute))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:text-[hsl(var(--av-night))] hover:decoration-[hsl(var(--av-gold))] transition-colors"
            >
              See structured programs
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
