"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REVEAL } from "./timeline";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates every `[data-reveal]` descendant of `ref` in on scroll, using
 * only the shared REVEAL choreography from timeline.ts — sections never
 * define their own duration/ease/offset.
 */
export function useSectionReveal(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current!);
      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: REVEAL.y, filter: `blur(${REVEAL.blur}px)` },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: REVEAL.duration,
            ease: REVEAL.ease,
            delay: (i % 6) * REVEAL.stagger,
            scrollTrigger: {
              trigger: el,
              start: REVEAL.scrollStart,
              end: REVEAL.scrollEnd,
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, ref);
    return () => ctx.revert();
  }, [ref]);
}
