"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { preloadHeroAssets } from "./assets/AssetManager";
import { ScrollProvider } from "./ScrollProvider";
import { FloatingNav, SectionRail } from "./FloatingNav";
import { Hero } from "./sections/Hero";
import { Journey } from "./sections/Journey";
import { Science } from "./sections/Science";
import { Programs } from "./sections/Programs";
import { Journal } from "./sections/Journal";
import { Testimonials } from "./sections/Testimonials";
import { CTA } from "./sections/CTA";

// The R3F canvas is client-only and non-trivial to construct — load it
// lazily so it never blocks first paint or ships into the server bundle.
const SceneCanvas = dynamic(() => import("./SceneCanvas").then((m) => m.SceneCanvas), {
  ssr: false,
});

/**
 * Cinematic AUMVEDA homepage — a single continuous scroll experience.
 * A persistent R3F scene (fog, glass, copper, drifting camera) sits fixed
 * behind every section; the content floats above it in glass panels.
 * Art direction only borrowed from the reference film — no literal layout
 * copy, since the film carries no UI to copy.
 */
export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Kick off hero-critical GLB preloading immediately — a no-op today since
  // no models are marked `available` yet in AssetManager, forward-compatible
  // once assets land in public/models/.
  useEffect(() => {
    preloadHeroAssets();
  }, []);

  return (
    <>
      <SceneCanvas />
      <ScrollProvider rootRef={rootRef}>
        <FloatingNav />
        <SectionRail />
        <main className="relative z-10 text-[hsl(var(--av-parchment))]">
          <Hero />
          <Journey />
          <Science />
          <Programs />
          <Journal />
          <Testimonials />
          <CTA />
        </main>
      </ScrollProvider>
    </>
  );
}
