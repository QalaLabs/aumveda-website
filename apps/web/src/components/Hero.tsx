"use client";

import Link from "next/link";

/**
 * Night hero — 40% Aman silence + 25% Apple formula + 10% Calm breath.
 * No photo clutter. Slow breathing light. One CTA.
 */
export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[hsl(var(--av-ink))]"
      aria-labelledby="hero-brand"
    >
      {/* Soft breathing light — calm, not cosmic WebGL */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--av-gold)/0.07)] blur-3xl motion-safe:animate-[breath-glow_8s_ease-in-out_infinite]"
        aria-hidden
      />
      <div className="absolute inset-0 texture-paper opacity-30 pointer-events-none" aria-hidden />

      <div className="relative z-10 w-full max-w-[720px] mx-auto px-6 py-32 text-center space-y-10 md:space-y-12">
        <p
          id="hero-brand"
          className="font-serif text-[clamp(2.75rem,8vw,5rem)] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))]"
        >
          AUMVEDA
        </p>

        <div className="space-y-4">
          <h1 className="font-serif text-[clamp(1.35rem,3.2vw,2rem)] leading-snug tracking-[-0.01em] text-[hsl(var(--av-gold-soft))] text-balance">
            Your Daily Dose of Healing
          </h1>
          <p className="font-body text-sm md:text-base tracking-[0.06em] text-[hsl(var(--av-parchment)/0.65)]">
            Mother–Daughter Neuro-Vedic Healing
          </p>
        </div>

        <Link
          href="/step-1"
          className="inline-flex h-12 md:h-14 items-center justify-center px-10 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium text-base transition-transform duration-100 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold-soft))]"
        >
          Begin Your Journey
        </Link>
      </div>
    </section>
  );
}
