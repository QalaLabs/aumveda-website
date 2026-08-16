"use client";

import { useRef } from "react";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — editorial headline only, the meditation-garden beat's longest held
 * moment. The quote-card grid belongs on a dedicated page post-journey —
 * see homepage V2 blueprint, "UI Reduction Plan." Content preserved below,
 * unrendered.
 */
// const QUOTES = [
//   { q: "I did not know how loud my body had become until the Daily Dose taught me to listen. A few weeks in, I sleep like I have not in years.", a: "Priya M.", r: "Mumbai · Daily Dose" },
//   { q: "Archana and Sejal hold something rare — East and West without forcing either. I return to the practice the way one returns to weather.", a: "Kavya R.", r: "Bangalore · 1:1" },
//   { q: "There is a stillness here I have not found in years of trying. Quiet. Personal. It is changing how I move through my days.", a: "Sneha K.", r: "Delhi · Discovery" },
// ];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center px-6 text-center md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[12ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[4.9vw]"
      >
        Silence <span className="italic text-[hsl(var(--av-copper-soft))]">Heals.</span>
      </h2>
    </section>
  );
}
