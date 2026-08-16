"use client";

import { useRef } from "react";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — editorial headline only. The three-pillar grid (Eastern Wisdom,
 * Nervous System & Western Practice, The Daily Dose) belongs on a dedicated
 * page post-journey — see homepage V2 blueprint, "UI Reduction Plan."
 * Content preserved below, unrendered.
 */
// const PILLARS = [
//   { n: "i.", t: "Eastern Wisdom", d: "Vastu, astrology, tarot, karmic insight, and ritual — the lived lineage Archana carries from Jaipur, offered with reverence and precision." },
//   { n: "ii.", t: "Nervous System & Western Practice", d: "Breathwork, somatic work, vagus regulation, hypnotherapy, and CBT-informed coaching — Sejal's Mumbai practice, where the body learns safety again." },
//   { n: "iii.", t: "The Daily Dose", d: "A short, personalized practice each day — drawn from your portal profile and AHI — so healing accumulates in minutes, not marathons." },
// ];

export function Science() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="science"
      ref={ref}
      className="relative flex min-h-[90svh] w-full items-center justify-end px-6 text-right md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[14ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[5.3vw]"
      >
        Modern <span className="italic text-[hsl(var(--av-copper-soft))]">Science.</span>
      </h2>
    </section>
  );
}
