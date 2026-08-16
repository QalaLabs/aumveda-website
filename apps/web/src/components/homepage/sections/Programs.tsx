"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — the product-reveal beat. One object, discovered, not presented.
 * The former three-offering glass card list (1:1 sessions, Circles, Crystal
 * shop) belongs on a dedicated /services page post-journey — see homepage
 * V2 blueprint, "UI Reduction Plan." Content preserved below, unrendered.
 */
// const ITEMS = [
//   { k: "1:1", s: "With Sejal or Archana", p: "Private", d: "One-to-one sessions with Sejal (Healing Facilitator & Wellness Coach, Mumbai) or Archana (Vedic Practitioner, Jaipur) — held online or in person.", img: "/marketing/meditation.jpg" },
//   { k: "Circles", s: "Community Practice", p: "Shared", d: "Live community circles for shared ritual, breath, and reflection — belonging without performance.", img: "/marketing/ritual.jpg" },
//   { k: "Crystal", s: "Shop · Jaipur", p: "Curated", d: "A curated crystal shop rooted in Jaipur — pieces chosen with care for practice and presence.", img: "/marketing/herbs.jpg" },
// ];

export function Programs() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="programs"
      ref={ref}
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center px-6 text-center md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[12ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[4.9vw]"
      >
        One <span className="italic text-[hsl(var(--av-copper-soft))]">Ritual.</span>
      </h2>
      <Link
        data-reveal
        href="/step-1"
        className="mt-10 border-b border-[hsl(var(--av-parchment)/0.2)] pb-1 text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--av-parchment)/0.7)] transition-all duration-500 hover:border-[hsl(var(--av-copper-soft))] hover:text-[hsl(var(--av-copper-soft))]"
      >
        Explore the practice
      </Link>
    </section>
  );
}
