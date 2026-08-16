# AUMMVEDA homepage GLB assets

Every asset the homepage scene can ever use is registered in
[`apps/web/src/components/homepage/assets/AssetManager.tsx`](../../src/components/homepage/assets/AssetManager.tsx)
(`ASSET_MANIFEST`), grouped into eight categories. Drop a GLB at the path
below, then flip that id's `available: false → true` in the manifest — no
other code changes needed.

Scene ownership (which of Hero / Journey / Science / Programs / Journal /
Testimonials / CTA each asset belongs to) is declared per-entry via
`scenes: SectionId[]` and looked up through
[`EnvironmentManager.ts`](../../src/components/homepage/assets/EnvironmentManager.ts).

## Layout

```
public/models/
  decorative-props/   glass-flask.glb, glass-orb.glb, copper-bowl.glb,
                       prayer-bell.glb, incense-holder.glb, wooden-tray.glb
  environment/         travertine-slab.glb, fog-volume-interior.glb,
                       himalayan-skyline.glb, water-plane-reflective.glb,
                       hdri-dawn-interior.hdr, hdri-temple-exterior.hdr
  architecture/        stone-doorway.glb, threshold-arch.glb,
                       lab-interior-shell.glb, himalayan-temple.glb,
                       temple-colonnade.glb, stone-platform.glb
  laboratory/           glass-beaker-large.glb, copper-distiller.glb,
                       herb-drying-rack.glb, instrument-cluster.glb,
                       steam-emitter-prop.glb
  ingredients/          ashwagandha.glb, tulsi.glb, brahmi.glb, giloy.glb,
                       turmeric.glb
  fx/                   god-ray-cone.glb, water-ripple.glb,
                       ember-swarm.glb, steam-wisp.glb
  products/             serum-bottle.glb, balm-jar.glb, ritual-kit-box.glb
  logos/                ayurvedic-symbol-glow.glb, aummveda-wordmark-3d.glb
```

The full id ↔ filename ↔ scene ↔ priority table lives in `ASSET_MANIFEST` —
that's the single source of truth; this file just orients you to the folders.

## Requirements

- Export as `.glb` (binary, single file — textures embedded). `.hdr`
  environment maps are registered for planning but not wired to a loader
  yet — see `format: "hdri"` entries in the manifest.
- Draco-compress the mesh geometry if the source tool supports it
  (`AssetManager` decodes with drei's `useGLTF`, Draco + Meshopt both on by
  default).
- Match the manifest's `boundingBox` estimate (meters, real-world/authoring
  scale) reasonably closely — it's the size the scene was art-directed
  around, not a hard constraint.
- `priority: "hero-critical"` assets load before first paint via
  `preloadHeroAssets()`; keep those especially lean.

Until a file lands, `AssetManager` renders nothing in every environment
(production and development alike) and logs a dev-only console warning — it
never substitutes a primitive sphere/box/cone, and no scene geometry is
placed until an asset is both `available` and actually mounted into a scene.
