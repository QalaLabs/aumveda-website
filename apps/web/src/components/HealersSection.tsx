"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Trust section — lineage is the differentiator.
 * Soft text link to About only; primary CTA remains Begin on homepage.
 * Swap Unsplash for real founder photos when ready:
 *   /practitioners/sejal-jain.jpg · /practitioners/archana-jain.jpg
 */
const SEJAL =
  "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=1200";
const ARCHANA =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200";

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQFBv/EABQBAQAAAAAAAAAAAAAAAAAAAAP/2gAMAwEAAhADEAAAAcpixczEK//EABwQAAICAgMAAAAAAAAAAAAAAAECAwQFEQASIf/aAAgBAQABBQINTKz7c5nSHRDSKcMU+P/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EAB4QAAECBwEAAAAAAAAAAAAAAAECAwAEERIhIjFB/9oACAEBAAY/AtvIojDeBOtSMt2ii5FCiw3wSJXvv+n/xAAdEAEAAgEFAQAAAAAAAAAAAAABABEhMUFRYXGB/9oACAEBAAE/IcuNjvIGxLpwyrpEXczTFywwcE6/BAWMPUvxAWFn8Wf/2gAMAwEAAgADAAAAENf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/EDX/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/EDX/xAAdEAEBAAIBBQAAAAAAAAAAAAABEQAhMUFhcYGh/9oACAEBAAE/EE/PAlV5AGoGngIPS8Yg67AmJIcnJvKGN4E5nBjtxg7Q+FRP2b//2Q==";

const HealersSection = () => {
  return (
    <section
      className="border-t border-[hsl(var(--av-stone))] bg-[hsl(var(--av-parchment))]"
      aria-labelledby="healers-heading"
    >
      <div className="max-w-[1120px] mx-auto px-6 py-20 md:py-28 space-y-16 md:space-y-20">
        <div className="max-w-2xl space-y-4">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
            Mother and daughter
          </p>
          <h2
            id="healers-heading"
            className="font-serif text-3xl md:text-5xl text-[hsl(var(--av-night))] leading-tight"
          >
            Two traditions. One healing relationship.
          </h2>
          <p className="font-body text-base text-[hsl(var(--av-mute))] leading-relaxed max-w-[55ch]">
            Not co-founders on a slide — a lineage. Eastern roots meet Western nervous-system work,
            held by the same family across Jaipur and Mumbai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <article className="space-y-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl outline outline-1 outline-black/5 -outline-offset-1">
              <Image
                src={SEJAL}
                alt="Sejal Jain, Healing Facilitator and Wellness Coach, Mumbai"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[hsl(var(--av-night))]">Sejal Jain</h3>
              <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                Healing Facilitator · Somatic & nervous-system work · Mumbai
              </p>
            </div>
          </article>

          <article className="space-y-5 md:pt-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl outline outline-1 outline-black/5 -outline-offset-1">
              <Image
                src={ARCHANA}
                alt="Archana Jain, Vedic Practitioner and Healer, Jaipur"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[hsl(var(--av-night))]">Archana Jain</h3>
              <p className="font-body text-sm text-[hsl(var(--av-mute))]">
                Vedic Practitioner · Astrology, Vastu, ritual · Jaipur
              </p>
            </div>
          </article>
        </div>

        <p className="text-center">
          <Link
            href="/about"
            className="font-body text-sm text-[hsl(var(--av-night))] underline underline-offset-4 decoration-[hsl(var(--av-stone))] hover:decoration-[hsl(var(--av-gold))] transition-colors"
          >
            Read our story
          </Link>
        </p>
      </div>
    </section>
  );
};

export default HealersSection;
