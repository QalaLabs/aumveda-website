"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — editorial headline + one door. No eyebrow, no paragraph, no meta
 * row. The world (StoryboardLayers' Himalaya-dawn beat) carries the rest.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[720px] w-full flex-col items-start justify-end px-6 pb-24 md:items-center md:justify-center md:px-16 md:pb-0 md:text-center"
    >
      <h1
        data-reveal
        className="av-film-title max-w-[16ch] font-serif text-[12vw] leading-[0.94] tracking-[-0.03em] text-[hsl(var(--av-parchment))] md:text-[6.5vw] lg:text-[5.3vw]"
      >
        Ancient Wisdom.
      </h1>
      <Link
        data-reveal
        href="/step-1"
        className="group mt-12 inline-flex items-center gap-4 border-b border-[hsl(var(--av-parchment)/0.25)] pb-1 text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment)/0.75)] transition-all duration-500 hover:gap-6 hover:border-[hsl(var(--av-copper-soft))] hover:text-[hsl(var(--av-copper-soft))]"
      >
        <span>Begin</span>
        <svg width="20" height="8" viewBox="0 0 24 8" fill="none" aria-hidden>
          <path d="M0 4h22m0 0L18.5 0.5M22 4l-3.5 3.5" stroke="currentColor" strokeWidth="0.9" />
        </svg>
      </Link>
    </section>
  );
}
