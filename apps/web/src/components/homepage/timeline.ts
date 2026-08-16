/**
 * ScrollTimeline — single source of truth for the cinematic homepage.
 *
 * Nothing in the homepage components should hardcode a duration, easing,
 * camera position, or color stop. Everything reads from here so the whole
 * experience can be retimed/regraded from one file.
 *
 * Scroll progress is a normalized 0→1 value across the full homepage,
 * driven by ScrollProvider (Lenis + a master GSAP ScrollTrigger).
 */

export type Vec3 = [number, number, number];

export interface SectionKeyframe {
  id: SectionId;
  /** Normalized scroll progress (0–1) at which this section is centered. */
  progress: number;
  /** R3F camera position at this keyframe. */
  camera: Vec3;
  /** Point the camera looks toward at this keyframe. */
  lookAt: Vec3;
  camFov: number;
  /** Scene light/fog color at this keyframe (hex). */
  fogColor: string;
  lightColor: string;
  fogDensity: number;
}

export type SectionId =
  | "hero"
  | "journey"
  | "science"
  | "programs"
  | "journal"
  | "testimonials"
  | "cta";

export const SECTION_ORDER: SectionId[] = [
  "hero",
  "journey",
  "science",
  "programs",
  "journal",
  "testimonials",
  "cta",
];

export const SECTION_META: Record<SectionId, { index: string; label: string }> = {
  hero: { index: "00", label: "Arrival" },
  journey: { index: "01", label: "The Journey" },
  science: { index: "02", label: "The Science" },
  programs: { index: "03", label: "Programs" },
  journal: { index: "04", label: "The Journal" },
  testimonials: { index: "05", label: "Reflections" },
  cta: { index: "06", label: "Begin" },
};

/**
 * Camera drifts slowly through the scene as the page is scrolled — never a
 * hard cut, always an interpolation between the nearest two keyframes.
 * Values are deliberately gentle: this is ambient atmosphere, not a ride.
 */
/**
 * Camera path — a single Steadicam walk through one connected sanctuary,
 * not seven fixed viewpoints with pictures swapped behind them. `z` sweeps
 * meaningfully (arrival far → product close → sunrise pulled back out) so
 * scrolling reads as approaching, passing through, and leaving each space.
 * `lookAt` stays anchored near the world's shared depth band (StoryboardLayers'
 * midground plane, z ≈ −3.2) throughout, so the gaze never snaps — only the
 * vantage point travels. EnvironmentDirector layers idle breathing on top of
 * every one of these positions; it never replaces this path.
 */
export const CAMERA_KEYFRAMES: SectionKeyframe[] = [
  {
    id: "hero",
    progress: 0,
    camera: [0, 0.5, 7.6],
    lookAt: [0, 0.1, -2.4],
    camFov: 40,
    fogColor: "#0d0a17",
    lightColor: "#f4e3c8",
    fogDensity: 0.03, // was 0.055 — halved, "smoke machine" critique
  },
  {
    id: "journey",
    progress: 1 / 6,
    camera: [1.9, 0.85, 5.9],
    lookAt: [0.4, 0.25, -2.6],
    camFov: 41,
    fogColor: "#171126",
    lightColor: "#e9c9a6",
    fogDensity: 0.028,
  },
  {
    id: "science",
    progress: 2 / 6,
    camera: [-2.3, 1.15, 4.0],
    lookAt: [-0.5, 0.35, -2.4],
    camFov: 35,
    fogColor: "#221a33",
    lightColor: "#d9b98c",
    fogDensity: 0.026,
  },
  {
    id: "programs",
    progress: 3 / 6,
    camera: [0.6, 0.05, 2.4],
    lookAt: [0.1, -0.05, -0.6],
    camFov: 29,
    fogColor: "#1b1428",
    lightColor: "#e7bd8a",
    fogDensity: 0.023,
  },
  {
    id: "journal",
    progress: 4 / 6,
    camera: [-1.7, -0.3, 4.7],
    lookAt: [-0.2, -0.05, -2.2],
    camFov: 37,
    fogColor: "#120e1d",
    lightColor: "#cbb08a",
    fogDensity: 0.031,
  },
  {
    id: "testimonials",
    progress: 5 / 6,
    camera: [1.1, 0.5, 6.8],
    lookAt: [0.15, 0.15, -2.8],
    camFov: 42,
    fogColor: "#0f0c19",
    lightColor: "#f0d3a3",
    fogDensity: 0.027,
  },
  {
    id: "cta",
    progress: 1,
    camera: [0, 0.6, 8.4],
    lookAt: [0, 0.15, -3],
    camFov: 39,
    fogColor: "#0a0812",
    lightColor: "#f6e6c4",
    fogDensity: 0.021,
  },
];

/** Shared reveal choreography — every section pulls from this, not ad-hoc numbers. */
export const REVEAL = {
  duration: 1.1,
  durationSlow: 1.6,
  stagger: 0.1,
  ease: "power3.out",
  easeSoft: "power2.out",
  y: 28,
  blur: 8,
  scrollStart: "top 78%",
  scrollEnd: "top 40%",
} as const;

/** Nav chrome timing. */
export const NAV = {
  condenseAt: 0.06, // scroll progress at which the floating nav condenses
  transition: 0.6,
  ease: "power2.out",
} as const;

/** Motion object (floating glass/copper props) drift parameters. */
export const MOTION_OBJECTS = {
  floatAmplitude: 0.16,
  floatSpeed: 0.35,
  rotationSpeed: 0.06,
  parallax: 0.6,
} as const;

export function getCameraKeyframes(): SectionKeyframe[] {
  return CAMERA_KEYFRAMES;
}

/**
 * STORY_BEATS (V3) — the real Flow-rendered footage from the AUMVEDA asset
 * pack (`aumveda other files/AUMVEDA ASSETS`), one beat per content section
 * so the environment always matches what's on screen: arrival → temple
 * threshold → laboratory → product → ritual stillness → warm reflection →
 * sunrise departure, closing the loop on the opening ridgeline. Purely
 * additive: does not change SectionId, CAMERA_KEYFRAMES, or any section's
 * copy/nav. Each beat is a "window" of curated footage projected on layered
 * depth planes in StoryboardLayers.tsx.
 *
 * A handful of additional renders (temple hall, architectural pillars, a
 * second copper-transition pass, a water/mist pass) are copied into
 * public/story/ but not wired to a beat yet — reserved B-roll for a future
 * pass that splits a section into two beats rather than one.
 */
export type StoryMediaType = "video" | "image";

export interface StoryBeat {
  id: string;
  /** Normalized 0–1 scroll progress at which this beat is fully in view. */
  progress: number;
  /** Path under apps/web/public/story/. */
  src: string;
  type: StoryMediaType;
  /** Short in-code note on why this asset was chosen — curation record. */
  note: string;
  /** Background-layer tint multiplied over the texture for grade continuity. */
  tint: string;
  /** How strongly the mid/foreground layers drift opposite scroll (parallax). */
  parallax: number;
}

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "himalaya-arrival",
    progress: 0,
    src: "/story/beat0-arrival.mp4",
    type: "video",
    note: "Snow ridgeline at first light — cold blue open establishes scale before warmth arrives. Pairs with the Hero beat.",
    tint: "#cdd9ea",
    parallax: 0.22,
  },
  {
    id: "temple-threshold",
    progress: 1 / 6,
    src: "/story/beat1-threshold.mp4",
    type: "video",
    note: "Temple courtyard — arrival resolves into the sanctuary's first architectural form. Pairs with the Journey beat.",
    tint: "#e7cfa4",
    parallax: 0.3,
  },
  {
    id: "ayurvedic-laboratory",
    progress: 2 / 6,
    src: "/story/beat3-lab.mp4",
    type: "video",
    note: "Copper/glass distillation workstation in motion — modern science enters without leaving the warm palette. Pairs with the Science beat.",
    tint: "#e2b98a",
    parallax: 0.32,
  },
  {
    id: "product-reveal",
    progress: 3 / 6,
    src: "/story/beat4-product.mp4",
    type: "video",
    note: "The platform morphing into the copper ritual bowl — the object discovered, not presented. Pairs with the Programs (\"One Ritual\") beat.",
    tint: "#e8bf86",
    parallax: 0.26,
  },
  {
    id: "ritual-stillness",
    progress: 4 / 6,
    src: "/story/beat5-ritual.jpg",
    type: "image",
    note: "Practitioner in the ritual space, soft fog — human presence for the reflective Journal beat. No motion render exists for this beat yet; held on a still with Three.js particle drift.",
    tint: "#e6cdae",
    parallax: 0.24,
  },
  {
    id: "copper-reflection",
    progress: 5 / 6,
    src: "/story/beat4b-copper.mp4",
    type: "video",
    note: "A second, warmer copper-bowl pass — closing warmth for the Testimonials/Reflections beat, distinct from the product-reveal beat.",
    tint: "#f0c48f",
    parallax: 0.28,
  },
  {
    id: "himalayan-sunrise",
    progress: 1,
    src: "/story/beat6-sunrise.mp4",
    type: "video",
    note: "Same ridgeline as the opening beat, now sun-warmed — closes the loop, brightest warm of the film. Pairs with the CTA beat.",
    tint: "#f6dfae",
    parallax: 0.2,
  },
];
