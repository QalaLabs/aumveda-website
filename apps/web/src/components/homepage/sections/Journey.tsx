"use client";

import { useRef } from "react";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — editorial headline only, no card grid. The four-step process (Portal
 * Decode, Daily Dose, Discovery Call, Ongoing Practice) previously shown as
 * a glass-card grid here belongs on a dedicated /how-it-works or /about
 * page post-journey, not inside the cinematic scroll — see homepage V2
 * blueprint, "UI Reduction Plan." Content preserved below, unrendered, so
 * it isn't lost — wire it into that future page rather than resurrecting
 * the card grid here.
 */
// const CHAPTERS = [
//   { n: "I", t: "Portal Decode", d: "Eight quiet steps. Breath, pattern, intention — a map of where you are before anything is prescribed." },
//   { n: "II", t: "Daily Dose", d: "A personalized 5–15 minute practice each day, shaped by your profile and AHI." },
//   { n: "III", t: "Discovery Call", d: "About fifteen quiet minutes with Sejal or Archana — to sense if this practice is right for you." },
//   { n: "IV", t: "Ongoing Practice", d: "1:1 sessions, community circles, and the rhythm of returning — as long as you need." },
// ];

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="journey"
      ref={ref}
      className="relative flex min-h-[90svh] w-full items-center px-6 md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[14ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[5.3vw]"
      >
        Heal the <span className="italic text-[hsl(var(--av-copper-soft))]">Root.</span>
      </h2>
    </section>
  );
}
