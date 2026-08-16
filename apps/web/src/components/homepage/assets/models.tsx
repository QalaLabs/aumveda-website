"use client";

import { Asset } from "./AssetManager";

/**
 * Drop-in, GLB-backed replacements for the scene's former primitive props.
 * Same prop surface as the old MotionObjects primitives (see
 * MotionObjects.tsx history) so SceneCanvas only had to change its import,
 * not its JSX. Each one resolves through AssetManager — real GLB when
 * available, dev-only TODO label otherwise, never a fallback primitive.
 */

export function GlassFlask({ scale = 1 }: { scale?: number }) {
  return <Asset id="glassFlask" scale={scale} />;
}

export function CopperBowl({ scale = 1 }: { scale?: number }) {
  return <Asset id="copperBowl" scale={scale} rotation={[Math.PI, 0, 0]} />;
}

export function GlassOrb({ scale = 1 }: { scale?: number }) {
  return <Asset id="glassOrb" scale={scale} />;
}

export function TravertineSlab({
  position = [0, -1.4, 0] as [number, number, number],
  width: _width = 4.2,
}: {
  position?: [number, number, number];
  width?: number;
}) {
  // `width` drove the old boxGeometry primitive's proportions; the GLB
  // carries its own authored dimensions, so the prop is kept for API
  // compatibility but intentionally unused.
  return <Asset id="travertineSlab" position={position} rotation={[-Math.PI / 2.6, 0, 0]} />;
}
