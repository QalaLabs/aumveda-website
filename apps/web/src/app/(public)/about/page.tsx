import Image from "next/image";
import Link from "next/link";

/**
 * About answers: Why trust this lineage?
 * Mother–daughter · Jaipur / Mumbai · Eastern + Western.
 * One primary CTA → /step-1. See DESIGN.md.
 */

const SEJAL =
  "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=1200";
const ARCHANA =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200";
const PLACE =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1600";

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQFBv/EABQBAQAAAAAAAAAAAAAAAAAAAAP/2gAMAwEAAhADEAAAAcpixczEK//EABwQAAICAgMAAAAAAAAAAAAAAAECAwQFEQASIf/aAAgBAQABBQINTKz7c5nSHRDSKcMU+P/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EAB4QAAECBwEAAAAAAAAAAAAAAAECAwAEERIhIjFB/9oACAEBAAY/AtvIojDeBOtSMt2ii5FCiw3wSJXvv+n/xAAdEAEAAgEFAQAAAAAAAAAAAAABABEhMUFRYXGB/9oACAEBAAE/IcuNjvIGxLpwyrpEXczTFywwcE6/BAWMPUvxAWFn8Wf/2gAMAwEAAgADAAAAENf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/EDX/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/EDX/xAAdEAEBAAIBBQAAAAAAAAAAAAABEQAhMUFhcYGh/9oACAEBAAE/EE/PAlV5AGoGngIPS8Yg67AmJIcnJvKGN4E5nBjtxg7Q+FRP2b//2Q==";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--av-parchment))] texture-paper">
      <main>
        {/* Hero — brand + one question */}
        <section className="border-b border-[hsl(var(--av-stone))]">
          <div className="max-w-[1120px] mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-24">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))] mb-6">
              About
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-[hsl(var(--av-night))] leading-[1.1] max-w-[18ch]">
              A mother, a daughter, and a practice between two cities.
            </h1>
            <p className="mt-8 font-body text-lg text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
              AUMVEDA is Neuro-Vedic healing held in one family — Archana in Jaipur,
              Sejal in Mumbai — so Eastern lineage and Western nervous-system work
              never have to compete.
            </p>
          </div>
        </section>

        {/* Place */}
        <section className="border-b border-[hsl(var(--av-stone))]">
          <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden">
            <Image
              src={PLACE}
              alt="Light across stone architecture — India"
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR}
              className="object-cover"
            />
          </div>
          <div className="max-w-[1120px] mx-auto px-6 py-12 md:py-16">
            <p className="font-body text-base md:text-lg text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[65ch]">
              Healing here is not a marketplace of modalities. It is a relationship —
              rooted in Jaipur&apos;s Vedic craft and Mumbai&apos;s clinical clarity —
              for the mind that is successful outside and unfinished within.
            </p>
          </div>
        </section>

        {/* Lineage */}
        <section
          className="border-b border-[hsl(var(--av-stone))]"
          aria-labelledby="lineage-heading"
        >
          <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 space-y-16 md:space-y-20">
            <div className="max-w-2xl space-y-4">
              <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
                Lineage
              </p>
              <h2
                id="lineage-heading"
                className="font-serif text-3xl md:text-5xl text-[hsl(var(--av-night))] leading-tight"
              >
                Mother and daughter.
              </h2>
              <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
                Not co-founders on a slide — a living bridge between traditions that
                usually stay apart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              <article className="space-y-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl outline outline-1 outline-black/5 -outline-offset-1">
                  <Image
                    src={ARCHANA}
                    alt="Archana Jain, Vedic Practitioner, Jaipur"
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                    Archana Jain
                  </h3>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                    Vedic Practitioner · Jaipur
                  </p>
                  <p className="font-body text-base text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[45ch]">
                    Astrology, Vastu, tarot, and crystalline practice — mapping timing,
                    space, and pattern so the outer world stops working against the
                    inner one.
                  </p>
                </div>
              </article>

              <article className="space-y-5 md:pt-12">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl outline outline-1 outline-black/5 -outline-offset-1">
                  <Image
                    src={SEJAL}
                    alt="Sejal Jain, Healing Facilitator, Mumbai"
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-[hsl(var(--av-night))]">
                    Sejal Jain
                  </h3>
                  <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                    Healing Facilitator · Mumbai
                  </p>
                  <p className="font-body text-base text-[hsl(var(--av-ink-text))] leading-relaxed max-w-[45ch]">
                    CBT, breathwork, hypnosis, sound, and talk therapy — rewiring the
                    nervous system so insight becomes felt change, not another insight.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Synthesis — quiet editorial, not pillar cards */}
        <section
          className="border-b border-[hsl(var(--av-stone))] bg-[hsl(var(--av-night))]"
          aria-labelledby="synthesis-heading"
        >
          <div className="max-w-[720px] mx-auto px-6 py-20 md:py-28 space-y-8 text-center">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
              Eastern and Western
            </p>
            <h2
              id="synthesis-heading"
              className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-parchment))] leading-snug text-balance"
            >
              A mind cannot heal if the subconscious is ignored. A life cannot settle
              if place and timing stay in discord.
            </h2>
            <p className="font-body text-base text-[hsl(var(--av-gold-soft))] opacity-80 leading-relaxed max-w-[55ch] mx-auto">
              That is why AUMVEDA holds both: Vedic architecture of meaning, and
              clinical care for the body that carries it — delivered as a daily dose,
              not a weekend workshop.
            </p>
          </div>
        </section>

        {/* One CTA */}
        <section>
          <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-8">
            <p className="font-serif text-xl md:text-2xl text-[hsl(var(--av-night))]">
              Begin with a breath. The path reveals itself from there.
            </p>
            <Link
              href="/step-1"
              className="inline-flex h-12 md:h-14 min-h-[44px] items-center justify-center px-8 md:px-10 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] font-body font-medium text-base transition-transform duration-[var(--duration-micro)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            >
              Begin Your Journey
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
