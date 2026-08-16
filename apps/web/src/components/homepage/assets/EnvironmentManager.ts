import { useMemo } from "react";
import {
  ASSET_MANIFEST,
  type AssetCategory,
  type AssetId,
  type AssetManifestEntry,
} from "./AssetManager";
import { SECTION_ORDER, type SectionId } from "../timeline";
import { useScrollProgress } from "../useScrollProgress";

/**
 * EnvironmentManager — scene-ownership lookup layer over AssetManager's
 * manifest.
 *
 * This module places NO geometry. It answers one question — "which asset
 * ids belong to scene X" — from data already declared in each manifest
 * entry's `scenes` field, so there is exactly one source of truth (the
 * manifest) and nothing here can drift out of sync with it.
 *
 * Nothing in the homepage renders through this yet. It exists so that a
 * future <SceneEnvironment sceneId="hero" /> (or similar) can mount real
 * <Asset id=".../> geometry per scene with zero manifest changes, once
 * production GLBs start landing. Wiring that up is a separate task.
 *
 * Does not touch camera/timeline/ScrollProvider/SceneCanvas — reads
 * SectionId/SECTION_ORDER and scroll progress, never writes to them.
 */

export interface OwnedAsset {
  id: AssetId;
  entry: AssetManifestEntry;
}

/**
 * Every manifest entry, grouped by the scene(s) it's owned by. Built once
 * (module init) by folding over ASSET_MANIFEST — an asset with
 * `scenes: ["hero", "journey"]` appears under both.
 */
export const SCENE_ASSET_MAP: Record<SectionId, OwnedAsset[]> = SECTION_ORDER.reduce(
  (map, sectionId) => {
    map[sectionId] = [];
    return map;
  },
  {} as Record<SectionId, OwnedAsset[]>
);

(Object.entries(ASSET_MANIFEST) as [AssetId, AssetManifestEntry][]).forEach(([id, entry]) => {
  entry.scenes.forEach((sceneId) => {
    SCENE_ASSET_MAP[sceneId].push({ id, entry });
  });
});

/** All assets registered for a given scene, in manifest declaration order. */
export function getSceneAssets(sceneId: SectionId): OwnedAsset[] {
  return SCENE_ASSET_MAP[sceneId] ?? [];
}

/** All assets in a given category, across every scene. */
export function getAssetsByCategory(category: AssetCategory): OwnedAsset[] {
  return (Object.entries(ASSET_MANIFEST) as [AssetId, AssetManifestEntry][])
    .filter(([, entry]) => entry.category === category)
    .map(([id, entry]) => ({ id, entry }));
}

/** Assets for a scene that are actually `available` today — i.e. safe to mount right now. */
export function getRenderableSceneAssets(sceneId: SectionId): OwnedAsset[] {
  return getSceneAssets(sceneId).filter(({ entry }) => entry.available);
}

/** Assets for a scene still waiting on their GLB — useful for a dev-mode coverage readout. */
export function getPendingSceneAssets(sceneId: SectionId): OwnedAsset[] {
  return getSceneAssets(sceneId).filter(({ entry }) => !entry.available);
}

/** React hook form of getSceneAssets — memoized per sceneId. */
export function useSceneAssets(sceneId: SectionId): OwnedAsset[] {
  return useMemo(() => getSceneAssets(sceneId), [sceneId]);
}

/**
 * Maps a normalized 0→1 scroll progress value to the nearest SectionId,
 * using the same evenly-spaced index scheme as timeline.ts's
 * CAMERA_KEYFRAMES (SECTION_ORDER[i] centered at i / (length - 1)).
 */
function sectionAtProgress(progress: number): SectionId {
  const lastIndex = SECTION_ORDER.length - 1;
  const index = Math.round(progress * lastIndex);
  return SECTION_ORDER[Math.min(Math.max(index, 0), lastIndex)];
}

/**
 * Reads live scroll progress and returns the current scene's assets plus
 * the next scene's — the look-ahead set a future preloader would fetch
 * just before the camera arrives, without guessing scroll direction.
 * Data only; does not itself trigger any loading.
 */
export function useUpcomingSceneAssets(): {
  current: SectionId;
  currentAssets: OwnedAsset[];
  next: SectionId | null;
  nextAssets: OwnedAsset[];
} {
  const progress = useScrollProgress((s) => s.progress);

  return useMemo(() => {
    const current = sectionAtProgress(progress);
    const currentIndex = SECTION_ORDER.indexOf(current);
    const next = currentIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentIndex + 1] : null;

    return {
      current,
      currentAssets: getSceneAssets(current),
      next,
      nextAssets: next ? getSceneAssets(next) : [],
    };
  }, [progress]);
}

// Re-exported for convenience so callers don't need a second import from timeline.ts.
export { sectionAtProgress };
