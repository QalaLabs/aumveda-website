"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SECTION_META, SECTION_ORDER } from "./timeline";
import { useEnvironment } from "./useEnvironment";
import { useScrollProgress } from "./useScrollProgress";

/**
 * V2 — no pill bar, no link row, no boxed chrome. Just a small wordmark
 * that tracks the film's chapter (EnvironmentDirector's `logoOpacity`
 * curve) rather than a single condense-point: full on arrival, recedes
 * while the film carries the scene alone through the mid chapters, returns
 * at the sunrise/CTA close. The dot rail (below) is the only other
 * persistent UI — together they're the entire nav.
 */
export function FloatingNav() {
  const wordmarkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = useEnvironment.getState().logoOpacity;
      if (wordmarkRef.current) {
        const current = Number(wordmarkRef.current.style.opacity || 1);
        wordmarkRef.current.style.opacity = String(current + (target - current) * 0.06);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
      <Link
        ref={wordmarkRef}
        href="#top"
        className="pointer-events-auto font-serif text-lg tracking-[0.1em] text-[hsl(var(--av-parchment)/0.92)] transition-colors hover:text-[hsl(var(--av-parchment))] md:text-xl"
      >
        AUMVEDA
      </Link>
      <Link
        href="/step-1"
        className="pointer-events-auto text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.55)] transition-colors hover:text-[hsl(var(--av-copper-soft))]"
      >
        Begin
      </Link>
    </header>
  );
}

/** Slim progress rail — dots only, no labels (labels narrate "sections," which the journey no longer has). */
export function SectionRail() {
  const progress = useScrollProgress((s) => s.progress);
  const activeIndex = Math.min(
    SECTION_ORDER.length - 1,
    Math.round(progress * (SECTION_ORDER.length - 1)),
  );

  return (
    <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      {SECTION_ORDER.map((id, i) => (
        <a key={id} href={`#${id}`} aria-label={SECTION_META[id].label}>
          <span
            className={`block h-1.5 w-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "scale-125 bg-[hsl(var(--av-copper-soft))]"
                : "bg-[hsl(var(--av-parchment)/0.25)] hover:bg-[hsl(var(--av-parchment)/0.5)]"
            }`}
          />
        </a>
      ))}
    </div>
  );
}
