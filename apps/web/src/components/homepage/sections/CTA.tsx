"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSectionReveal } from "../useSectionReveal";

/**
 * V2 — the sunrise beat. Editorial headline + one door, no glass box, no
 * eyebrow, no paragraph. The Footer below is genuinely post-journey content
 * (contact, links, legal) so it keeps its fuller conventional layout — the
 * V2 UI reduction only applies inside the cinematic scroll itself.
 */
export function CTA() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="cta"
      ref={ref}
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center px-6 text-center md:px-16"
    >
      <h2
        data-reveal
        className="av-film-title max-w-[16ch] font-serif text-[12vw] leading-[0.94] tracking-[-0.03em] text-[hsl(var(--av-parchment))] md:text-[6.5vw] lg:text-[5.3vw]"
      >
        Your Daily <span className="italic text-[hsl(var(--av-copper-soft))]">Dose.</span>
      </h2>
      <Link
        data-reveal
        href="/step-1"
        className="group mt-12 inline-flex items-center gap-5 rounded-full border border-[hsl(var(--av-copper)/0.55)] bg-[hsl(var(--av-copper)/0.1)] px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--av-parchment))] backdrop-blur-sm transition-all duration-700 hover:bg-[hsl(var(--av-copper))] hover:text-[hsl(var(--av-ink))]"
      >
        <span>Begin</span>
        <svg width="26" height="9" viewBox="0 0 28 10" fill="none" aria-hidden>
          <path d="M0 5h26m0 0L22 1M26 5l-4 4" stroke="currentColor" strokeWidth="0.9" />
        </svg>
      </Link>

      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-32 max-w-[1300px]">
      <div data-reveal className="font-serif text-[16vw] leading-[0.85] tracking-[-0.04em] text-[hsl(var(--av-parchment)/0.08)] md:text-[11vw]">
        AUMVEDA
      </div>
      <div
        data-reveal
        className="mt-14 grid grid-cols-2 gap-10 border-t border-[hsl(var(--av-parchment)/0.1)] pt-10 md:grid-cols-4 md:gap-8"
      >
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.4)]">
            Presence
          </div>
          <p className="mt-4 font-serif text-lg leading-relaxed text-[hsl(var(--av-parchment))]">
            Jaipur · Mumbai
            <br />
            Online
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.4)]">
            Correspondence
          </div>
          <a
            href="mailto:hello@aumveda.com"
            className="mt-4 block font-serif text-lg text-[hsl(var(--av-parchment))] transition-colors hover:text-[hsl(var(--av-copper-soft))]"
          >
            hello@aumveda.com
          </a>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.4)]">
            Explore
          </div>
          <ul className="mt-4 space-y-2 text-[hsl(var(--av-parchment))]">
            {[
              { l: "About", href: "/about" },
              { l: "Services", href: "/services" },
              { l: "Programmes", href: "/programs" },
              { l: "Insights", href: "/insights" },
            ].map((item) => (
              <li key={item.l}>
                <Link href={item.href} className="font-serif text-lg transition-colors hover:text-[hsl(var(--av-copper-soft))]">
                  {item.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.4)]">
            Practice
          </div>
          <p className="mt-4 text-[13px] leading-[1.8] text-[hsl(var(--av-parchment)/0.55)]">
            Mother–daughter Neuro-Vedic healing. Your Daily Dose of Healing —
            held with care.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] py-8 text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.4)] md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} AUMVEDA · Jaipur · Mumbai</div>
        <div className="flex gap-8">
          <Link href="/privacy-policy" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
            Terms
          </Link>
          <Link href="/login" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
            Client login
          </Link>
        </div>
      </div>
    </footer>
  );
}
