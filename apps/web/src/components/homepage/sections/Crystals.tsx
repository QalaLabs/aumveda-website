"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSectionReveal } from "../useSectionReveal";
import type { ProductView } from "@/lib/product-service";

/**
 * Featured-crystals teaser — the one cross-link from the cinematic homepage
 * into /shop. Follows the same reduced-UI pattern as Programs/Journal
 * (headline + single CTA), with a short "Recommended for you" list fetched
 * client-side so the teaser stays live without a server round-trip on the
 * homepage itself.
 *
 * Deliberately NOT added to timeline.ts's SectionId/CAMERA_KEYFRAMES/
 * STORY_BEATS — those are a hand-tuned 7-beat camera/fog/footage
 * choreography with no spare footage asset for a crystals beat. Adding an
 * 8th min-h-[90svh] section here only nudges later keyframes' effective
 * on-screen timing slightly; it does not break scroll or camera
 * interpolation. Retiming the film for a real 8th beat is a separate,
 * deliberate art-direction pass, not a byproduct of a cross-link.
 */
export function Crystals() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);
  const [products, setProducts] = useState<ProductView[]>([]);

  useEffect(() => {
    // /api/products ignores query params for anonymous visitors (it falls
    // back to a plain getActiveProducts() list), so filter/slice client-side
    // rather than trusting the query string to narrow the result.
    fetch("/api/products?category=Crystals&limit=3&isActive=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const all: ProductView[] = data?.products ?? [];
        setProducts(all.filter((p) => p.category === "Crystals").slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="crystals"
      ref={ref}
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center px-6 text-center md:px-16"
    >
      <p
        data-reveal
        className="mb-4 text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--av-parchment)/0.6)]"
      >
        Recommended for you
      </p>
      <h2
        data-reveal
        className="av-film-title max-w-[13ch] font-serif text-[10.5vw] leading-[0.96] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[4.9vw]"
      >
        Crystals, <span className="italic text-[hsl(var(--av-copper-soft))]">Chosen.</span>
      </h2>

      {products.length > 0 && (
        <ul data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/shop/${p.slug}`}
                className="text-sm text-[hsl(var(--av-parchment)/0.75)] underline underline-offset-4 decoration-[hsl(var(--av-parchment)/0.2)] transition-colors duration-300 hover:decoration-[hsl(var(--av-copper-soft))] hover:text-[hsl(var(--av-copper-soft))]"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        data-reveal
        href="/shop"
        className="mt-10 border-b border-[hsl(var(--av-parchment)/0.2)] pb-1 text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--av-parchment)/0.7)] transition-all duration-500 hover:border-[hsl(var(--av-copper-soft))] hover:text-[hsl(var(--av-copper-soft))]"
      >
        Enter the shop
      </Link>
    </section>
  );
}
