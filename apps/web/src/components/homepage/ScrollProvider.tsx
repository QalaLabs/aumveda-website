"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useScrollProgress } from "./useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts Lenis smooth-scroll, wires it into GSAP's ticker so ScrollTrigger
 * and Lenis agree on scroll position, and publishes normalized 0–1 scroll
 * progress + velocity to the global store that CameraController and every
 * section reads from. One instance for the whole homepage — do not nest.
 */
export function ScrollProvider({
  children,
  rootRef,
}: {
  children: ReactNode;
  rootRef: React.RefObject<HTMLDivElement>;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const setProgress = useScrollProgress.getState().setProgress;
    const setReducedMotion = useScrollProgress.getState().setReducedMotion;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    const lenis = new Lenis({
      duration: prefersReduced ? 0.4 : 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !prefersReduced,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress, velocity }: { progress: number; velocity: number }) => {
      setProgress(progress, velocity);
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Bridge ScrollTrigger to Lenis so section-level triggers stay in sync.
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.animatedScroll ?? window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("resize", refresh);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {children}
    </div>
  );
}
