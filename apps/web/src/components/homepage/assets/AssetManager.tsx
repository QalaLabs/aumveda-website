"use client";

import { Suspense, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import type { SectionId } from "../timeline";

/**
 * AssetManager — centralized GLB asset pipeline for the homepage 3D scene.
 *
 * Every production model the scene can render is declared once here: its
 * expected file path under apps/web/public/models/, whether the real GLB
 * has actually landed yet, which narrative scene(s) it belongs to, and its
 * preload priority.
 *
 * Hard rule: if `available` is false, <Asset> NEVER falls back to a
 * primitive mesh (sphere/box/cone/etc). It renders nothing in production
 * and a dev-only DOM label (not 3D geometry) — missing assets stay loud
 * in development and simply absent, not faked, in production builds.
 *
 * Does not touch camera/timeline/ScrollProvider/SceneCanvas architecture —
 * this module only supplies geometry (or, until it exists, a registry
 * entry) to slot into that engine. See EnvironmentManager.ts for the
 * scene-ownership lookup layer built on top of this manifest.
 */

/**
 * Logical grouping used for authoring, asset-pack handoff, and future
 * bundle-splitting. Purely organizational — does not affect loading.
 */
export type AssetCategory =
  | "environment"
  | "architecture"
  | "laboratory"
  | "ingredients"
  | "decorativeProps"
  | "fx"
  | "products"
  | "logos";

/**
 * Coarse loading urgency. "hero-critical" is preloaded via
 * `preloadHeroAssets()` before the camera reaches it; "eager" is expected
 * to be requested by `EnvironmentManager`'s look-ahead once that's wired
 * up; "lazy" only loads when its owning scene actually mounts it.
 */
export type PreloadPriority = "hero-critical" | "eager" | "lazy";

/** File format the asset will ship in — drives which loader handles it once wired. */
export type AssetFormat = "glb" | "hdri";

/**
 * Rough authoring-time footprint in meters, at the model's native/real-world
 * scale (not the in-scene camera-space scale applied at mount time). Lets
 * whoever authors the GLBs target a size before a single file exists.
 * Zero-volume entries (HDRIs) carry an all-zero box.
 */
export interface BoundingBoxEstimate {
  width: number;
  height: number;
  depth: number;
}

export type AssetId =
  // Decorative Props
  | "glassFlask"
  | "glassOrb"
  | "copperBowl"
  | "propPrayerBell"
  | "propIncenseHolder"
  | "propWoodenTray"
  // Environment
  | "travertineSlab"
  | "envHdriDawnInterior"
  | "envHdriTempleExterior"
  | "envFogVolumeInterior"
  | "envHimalayanSkyline"
  | "envWaterPlaneReflective"
  // Architecture
  | "archStoneDoorway"
  | "archThresholdArch"
  | "archLabInteriorShell"
  | "archHimalayanTemple"
  | "archTempleColonnade"
  | "archStonePlatform"
  // Laboratory
  | "labGlassBeakerLarge"
  | "labCopperDistiller"
  | "labHerbDryingRack"
  | "labInstrumentCluster"
  | "labSteamEmitterProp"
  // Ingredients
  | "ingredientAshwagandha"
  | "ingredientTulsi"
  | "ingredientBrahmi"
  | "ingredientGiloy"
  | "ingredientTurmeric"
  // FX
  | "fxGodRayCone"
  | "fxWaterRipple"
  | "fxEmberSwarm"
  | "fxSteamWisp"
  // Products
  | "productSerumBottle"
  | "productBalmJar"
  | "productRitualKitBox"
  // Logos
  | "logoAyurvedicSymbolGlow"
  | "logoAummvedaWordmark3d";

export interface AssetManifestEntry {
  /** Expected location under apps/web/public/. */
  path: string;
  /** Flip to true once the real GLB has been dropped into public/models/. */
  available: boolean;
  /** Human label used in dev warnings/labels. */
  label: string;
  /** Logical asset group — see AssetCategory. */
  category: AssetCategory;
  /** Which homepage scene(s) this asset belongs to. See timeline.ts SectionId. */
  scenes: SectionId[];
  /** Loading urgency. */
  priority: PreloadPriority;
  /** Authoring-time size estimate in meters. */
  boundingBox: BoundingBoxEstimate;
  /** Loader family. Defaults to "glb" when omitted. */
  format?: AssetFormat;
}

const ZERO_BOX: BoundingBoxEstimate = { width: 0, height: 0, depth: 0 };

export const ASSET_MANIFEST: Record<AssetId, AssetManifestEntry> = {
  // ── Decorative Props ────────────────────────────────────────────────
  // Already wired into SceneCanvas via assets/models.tsx — these four are
  // the only ids anything actually renders today.
  glassFlask: {
    path: "/models/decorative-props/glass-flask.glb",
    available: false,
    label: "Glass Flask",
    category: "decorativeProps",
    scenes: ["hero", "journey"],
    priority: "hero-critical",
    boundingBox: { width: 0.18, height: 0.32, depth: 0.18 },
  },
  glassOrb: {
    path: "/models/decorative-props/glass-orb.glb",
    available: false,
    label: "Glass Orb",
    category: "decorativeProps",
    scenes: ["journey", "testimonials"],
    priority: "hero-critical",
    boundingBox: { width: 0.16, height: 0.16, depth: 0.16 },
  },
  copperBowl: {
    path: "/models/decorative-props/copper-bowl.glb",
    available: false,
    label: "Copper Bowl",
    category: "decorativeProps",
    scenes: ["hero", "science"],
    priority: "hero-critical",
    boundingBox: { width: 0.4, height: 0.2, depth: 0.4 },
  },
  propPrayerBell: {
    path: "/models/decorative-props/prayer-bell.glb",
    available: false,
    label: "Prayer Bell",
    category: "decorativeProps",
    scenes: ["testimonials"],
    priority: "lazy",
    boundingBox: { width: 0.15, height: 0.2, depth: 0.15 },
  },
  propIncenseHolder: {
    path: "/models/decorative-props/incense-holder.glb",
    available: false,
    label: "Incense Holder",
    category: "decorativeProps",
    scenes: ["journal"],
    priority: "lazy",
    boundingBox: { width: 0.1, height: 0.15, depth: 0.1 },
  },
  propWoodenTray: {
    path: "/models/decorative-props/wooden-tray.glb",
    available: false,
    label: "Wooden Tray",
    category: "decorativeProps",
    scenes: ["programs"],
    priority: "lazy",
    boundingBox: { width: 0.5, height: 0.05, depth: 0.35 },
  },

  // ── Environment ──────────────────────────────────────────────────────
  travertineSlab: {
    path: "/models/environment/travertine-slab.glb",
    available: false,
    label: "Travertine Slab",
    category: "environment",
    scenes: ["hero", "journey", "science", "programs"],
    priority: "hero-critical",
    boundingBox: { width: 4.2, height: 0.18, depth: 2.6 },
  },
  envHdriDawnInterior: {
    path: "/models/environment/hdri-dawn-interior.hdr",
    available: false,
    label: "Dawn Interior HDRI",
    category: "environment",
    scenes: ["hero", "cta"],
    priority: "hero-critical",
    boundingBox: ZERO_BOX,
    format: "hdri",
  },
  envHdriTempleExterior: {
    path: "/models/environment/hdri-temple-exterior.hdr",
    available: false,
    label: "Temple Exterior HDRI",
    category: "environment",
    scenes: ["journal"],
    priority: "eager",
    boundingBox: ZERO_BOX,
    format: "hdri",
  },
  envFogVolumeInterior: {
    path: "/models/environment/fog-volume-interior.glb",
    available: false,
    label: "Interior Fog Volume",
    category: "environment",
    scenes: ["hero", "journey"],
    priority: "hero-critical",
    boundingBox: { width: 8, height: 4, depth: 6 },
  },
  envHimalayanSkyline: {
    path: "/models/environment/himalayan-skyline.glb",
    available: false,
    label: "Himalayan Skyline",
    category: "environment",
    scenes: ["journal", "cta"],
    priority: "lazy",
    boundingBox: { width: 200, height: 60, depth: 200 },
  },
  envWaterPlaneReflective: {
    path: "/models/environment/water-plane-reflective.glb",
    available: false,
    label: "Reflective Water Plane",
    category: "environment",
    scenes: ["journal"],
    priority: "eager",
    boundingBox: { width: 40, height: 0.02, depth: 40 },
  },

  // ── Architecture ─────────────────────────────────────────────────────
  archStoneDoorway: {
    path: "/models/architecture/stone-doorway.glb",
    available: false,
    label: "Stone Doorway",
    category: "architecture",
    scenes: ["hero", "journey"],
    priority: "hero-critical",
    boundingBox: { width: 3, height: 4.2, depth: 0.6 },
  },
  archThresholdArch: {
    path: "/models/architecture/threshold-arch.glb",
    available: false,
    label: "Threshold Arch",
    category: "architecture",
    scenes: ["journey"],
    priority: "eager",
    boundingBox: { width: 2.6, height: 3.8, depth: 0.8 },
  },
  archLabInteriorShell: {
    path: "/models/architecture/lab-interior-shell.glb",
    available: false,
    label: "Laboratory Interior Shell",
    category: "architecture",
    scenes: ["science"],
    priority: "eager",
    boundingBox: { width: 10, height: 4, depth: 8 },
  },
  archHimalayanTemple: {
    path: "/models/architecture/himalayan-temple.glb",
    available: false,
    label: "Himalayan Temple",
    category: "architecture",
    scenes: ["journal"],
    priority: "lazy",
    boundingBox: { width: 40, height: 25, depth: 40 },
  },
  archTempleColonnade: {
    path: "/models/architecture/temple-colonnade.glb",
    available: false,
    label: "Temple Colonnade",
    category: "architecture",
    scenes: ["journal"],
    priority: "lazy",
    boundingBox: { width: 12, height: 5, depth: 3 },
  },
  archStonePlatform: {
    path: "/models/architecture/stone-platform.glb",
    available: false,
    label: "Stone Platform",
    category: "architecture",
    scenes: ["programs"],
    priority: "eager",
    boundingBox: { width: 2, height: 0.4, depth: 2 },
  },

  // ── Laboratory ───────────────────────────────────────────────────────
  labGlassBeakerLarge: {
    path: "/models/laboratory/glass-beaker-large.glb",
    available: false,
    label: "Large Glass Beaker",
    category: "laboratory",
    scenes: ["science"],
    priority: "eager",
    boundingBox: { width: 0.25, height: 0.35, depth: 0.25 },
  },
  labCopperDistiller: {
    path: "/models/laboratory/copper-distiller.glb",
    available: false,
    label: "Copper Distiller",
    category: "laboratory",
    scenes: ["science"],
    priority: "eager",
    boundingBox: { width: 0.6, height: 0.7, depth: 0.4 },
  },
  labHerbDryingRack: {
    path: "/models/laboratory/herb-drying-rack.glb",
    available: false,
    label: "Herb Drying Rack",
    category: "laboratory",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 1.2, height: 1.6, depth: 0.4 },
  },
  labInstrumentCluster: {
    path: "/models/laboratory/instrument-cluster.glb",
    available: false,
    label: "Scientific Instrument Cluster",
    category: "laboratory",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.8, height: 0.5, depth: 0.6 },
  },
  labSteamEmitterProp: {
    path: "/models/laboratory/steam-emitter-prop.glb",
    available: false,
    label: "Steam Emitter Prop",
    category: "laboratory",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.3, height: 0.4, depth: 0.3 },
  },

  // ── Ingredients ──────────────────────────────────────────────────────
  ingredientAshwagandha: {
    path: "/models/ingredients/ashwagandha.glb",
    available: false,
    label: "Ashwagandha Root",
    category: "ingredients",
    scenes: ["journey", "science"],
    priority: "eager",
    boundingBox: { width: 0.12, height: 0.18, depth: 0.12 },
  },
  ingredientTulsi: {
    path: "/models/ingredients/tulsi.glb",
    available: false,
    label: "Tulsi Leaf Cluster",
    category: "ingredients",
    scenes: ["journey", "science"],
    priority: "eager",
    boundingBox: { width: 0.2, height: 0.22, depth: 0.2 },
  },
  ingredientBrahmi: {
    path: "/models/ingredients/brahmi.glb",
    available: false,
    label: "Brahmi Leaf",
    category: "ingredients",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.15, height: 0.1, depth: 0.15 },
  },
  ingredientGiloy: {
    path: "/models/ingredients/giloy.glb",
    available: false,
    label: "Giloy Stem",
    category: "ingredients",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.1, height: 0.3, depth: 0.1 },
  },
  ingredientTurmeric: {
    path: "/models/ingredients/turmeric.glb",
    available: false,
    label: "Turmeric Root",
    category: "ingredients",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.14, height: 0.08, depth: 0.14 },
  },

  // ── FX ───────────────────────────────────────────────────────────────
  // Procedural fog/particles (fogExp2, drei Sparkles) stay code-driven in
  // SceneCanvas — these are art-directed VFX geometry, not a replacement.
  fxGodRayCone: {
    path: "/models/fx/god-ray-cone.glb",
    available: false,
    label: "God Ray Cone",
    category: "fx",
    scenes: ["hero", "journal", "cta"],
    priority: "hero-critical",
    boundingBox: { width: 2, height: 6, depth: 2 },
  },
  fxWaterRipple: {
    path: "/models/fx/water-ripple.glb",
    available: false,
    label: "Water Ripple",
    category: "fx",
    scenes: ["journal"],
    priority: "eager",
    boundingBox: { width: 1, height: 0.05, depth: 1 },
  },
  fxEmberSwarm: {
    path: "/models/fx/ember-swarm.glb",
    available: false,
    label: "Ember Swarm",
    category: "fx",
    scenes: ["testimonials", "cta"],
    priority: "lazy",
    boundingBox: { width: 3, height: 2, depth: 3 },
  },
  fxSteamWisp: {
    path: "/models/fx/steam-wisp.glb",
    available: false,
    label: "Steam Wisp",
    category: "fx",
    scenes: ["science"],
    priority: "lazy",
    boundingBox: { width: 0.3, height: 0.6, depth: 0.3 },
  },

  // ── Products ─────────────────────────────────────────────────────────
  productSerumBottle: {
    path: "/models/products/serum-bottle.glb",
    available: false,
    label: "Serum Bottle",
    category: "products",
    scenes: ["programs"],
    priority: "eager",
    boundingBox: { width: 0.05, height: 0.12, depth: 0.05 },
  },
  productBalmJar: {
    path: "/models/products/balm-jar.glb",
    available: false,
    label: "Balm Jar",
    category: "products",
    scenes: ["programs"],
    priority: "eager",
    boundingBox: { width: 0.06, height: 0.05, depth: 0.06 },
  },
  productRitualKitBox: {
    path: "/models/products/ritual-kit-box.glb",
    available: false,
    label: "Ritual Kit Box",
    category: "products",
    scenes: ["programs"],
    priority: "lazy",
    boundingBox: { width: 0.24, height: 0.1, depth: 0.18 },
  },

  // ── Logos ────────────────────────────────────────────────────────────
  logoAyurvedicSymbolGlow: {
    path: "/models/logos/ayurvedic-symbol-glow.glb",
    available: false,
    label: "Ayurvedic Symbol (Glowing)",
    category: "logos",
    scenes: ["hero"],
    priority: "hero-critical",
    boundingBox: { width: 0.6, height: 0.6, depth: 0.1 },
  },
  logoAummvedaWordmark3d: {
    path: "/models/logos/aummveda-wordmark-3d.glb",
    available: false,
    label: "AUMMVEDA Wordmark (3D)",
    category: "logos",
    scenes: ["cta"],
    priority: "lazy",
    boundingBox: { width: 2, height: 0.4, depth: 0.1 },
  },
};

/**
 * Draco decoder path. Undefined defers to drei's built-in default (the
 * public Google-hosted CDN decoder), so compressed GLBs work out of the
 * box with zero setup. Set NEXT_PUBLIC_DRACO_DECODER_PATH to self-host —
 * copy three's draco_decoder.js/.wasm into apps/web/public/draco/ and
 * point this at "/draco/" — for offline builds or to drop the CDN
 * dependency. See apps/web/public/draco/README.md.
 */
const DRACO_DECODER_PATH = process.env.NEXT_PUBLIC_DRACO_DECODER_PATH?.trim() || undefined;

/** Group-level transform props every asset slot accepts — position/rotation/scale only. */
export interface AssetTransformProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/** Loads and clones a manifest entry's GLB scene graph. Draco + Meshopt both on. */
function AssetModel({
  entry,
  ...transform
}: { entry: AssetManifestEntry } & AssetTransformProps) {
  const { scene } = useGLTF(entry.path, DRACO_DECODER_PATH ?? true, true);
  return <primitive object={scene.clone(true)} {...transform} />;
}

/**
 * Missing-asset handler — renders nothing, always, in every environment.
 * The visitor must never see debug information; a missing GLB fails
 * silently in the scene. Development still gets a console warning (not a
 * visual marker of any kind) so it stays loud to whoever's authoring
 * assets without ever being visible on the actual page.
 */
function AssetTODO({ id, entry }: { id: AssetId; entry: AssetManifestEntry } & AssetTransformProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[AssetManager] "${id}" (${entry.label}) has no GLB yet. ` +
          `Expected at apps/web/public${entry.path}. Rendering nothing.`
      );
    }
  }, [id, entry]);

  return null;
}

/**
 * Reusable asset slot. Looks up `id` in the manifest and either renders the
 * real GLB (Suspense-wrapped so a slow/late load never blocks siblings) or
 * the dev TODO marker if the file hasn't landed yet.
 */
export function Asset({ id, ...transform }: { id: AssetId } & AssetTransformProps) {
  const entry = ASSET_MANIFEST[id];
  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[AssetManager] Unknown asset id "${id}"`);
    }
    return null;
  }
  // Only the "glb" loader path exists today (useGLTF). An HDRI (or any
  // future non-glb format) marked `available` still can't render through
  // this component yet — treat it the same as missing until that loader
  // is wired, rather than silently no-op-ing on a bad useGLTF call.
  const loadable = entry.available && (entry.format ?? "glb") === "glb";
  if (!loadable) {
    return <AssetTODO id={id} entry={entry} {...transform} />;
  }
  return (
    <Suspense fallback={null}>
      <AssetModel entry={entry} {...transform} />
    </Suspense>
  );
}

/**
 * Preload every manifest entry with `priority: "hero-critical"` that's
 * both `available` and a "glb" (the only format `useGLTF` can load today).
 * Call once, early — see HomePage.tsx — so hero-critical models are
 * already cached by the time the camera reaches them. A no-op for entries
 * still marked unavailable, so it's safe to call today.
 */
export function preloadHeroAssets() {
  Object.values(ASSET_MANIFEST).forEach((entry) => {
    if (entry.priority === "hero-critical" && entry.available && (entry.format ?? "glb") === "glb") {
      useGLTF.preload(entry.path, DRACO_DECODER_PATH ?? true, true);
    }
  });
}
