"use client";

import { useRef } from "react";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — editorial headline only. The journal post list belongs on a
 * dedicated /insights page post-journey — see homepage V2 blueprint,
 * "UI Reduction Plan." Content preserved below, unrendered.
 */
// const POSTS = [
//   { d: "Sep 2026", t: "On the vagus nerve, and returning to the body.", c: "Practice" },
//   { d: "Aug 2026", t: "Why we say Daily Dose — not wellness.", c: "Essays" },
//   { d: "Jul 2026", t: "A conversation with my mother, on returning home.", c: "Lineage" },
// ];

export function Journal() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="journal"
      ref={ref}
      className="relative flex min-h-[90svh] w-full items-center px-6 md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[14ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[5.3vw]"
      >
        Nature <span className="italic text-[hsl(var(--av-copper-soft))]">Remembers.</span>
      </h2>
    </section>
  );
}
