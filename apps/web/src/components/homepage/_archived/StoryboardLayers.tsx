"use client";

import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { STORY_BEATS, type StoryBeat } from "../timeline";
import { useScrollProgress } from "../useScrollProgress";

/**
 * One failed image/video load (bad path, dev-server restart mid-fetch, a
 * flaky CDN in production) must never take down the whole R3F canvas — the
 * AssetManager already treats a missing GLB as "render nothing", and beats
 * get the same contract here. Scoped per-beat so a single bad asset just
 * drops that one beat's layers; every other beat and the hero props
 * (flask/bowl/orb/slab) keep rendering untouched.
 */
class BeatErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[StoryboardLayers] beat failed to load, dropping it silently:", error);
    }
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * StoryboardLayers — the 10-beat cinematic journey (Himalaya → temple → lab
 * → ingredients → product → garden → sunrise), rendered as curated
 * reference footage projected on layered depth planes behind the existing
 * hero props (flask/bowl/orb/slab).
 *
 * Deliberately NOT a fullscreen image slideshow:
 *  - background: a wide curved cyclorama (part-cylinder) far behind camera
 *  - midground: a smaller "framed window" plane with independent drift
 *  - veil: a near-transparent atmosphere card that sits between midground
 *    and the hero props, so fog/parallax reads as real depth, not a poster
 *
 * Only the ±1 neighboring beats around current scroll progress are ever
 * mounted (textures/video decode released the moment a beat scrolls out of
 * that window) — this is the lazy-load boundary the brief asked for.
 * Crossfade is a plain triangular weight against neighboring beats'
 * progress values, written directly into material.opacity every frame
 * (no React state in the hot path) so it stays cheap at 60fps.
 */

const CYCLORAMA_RADIUS = 9;
const CYCLORAMA_ARC = Math.PI * 0.62;

function nearestBeatIndex(progress: number) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < STORY_BEATS.length; i++) {
    const d = Math.abs(STORY_BEATS[i].progress - progress);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

function activeWindow(idx: number) {
  const win = new Set<number>();
  win.add(idx);
  if (idx > 0) win.add(idx - 1);
  if (idx < STORY_BEATS.length - 1) win.add(idx + 1);
  return Array.from(win).sort((a, b) => a - b);
}

function sameWindow(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** Triangular crossfade weight — 1 at this beat's own progress, 0 at either neighbor's. */
function beatWeight(progress: number, index: number) {
  const beat = STORY_BEATS[index];
  const prev = STORY_BEATS[index - 1];
  const next = STORY_BEATS[index + 1];
  if (progress <= beat.progress) {
    const floor = prev ? prev.progress : beat.progress - 0.15;
    const span = beat.progress - floor || 1;
    return THREE.MathUtils.clamp(1 - (beat.progress - progress) / span, 0, 1);
  }
  const ceil = next ? next.progress : beat.progress + 0.15;
  const span = ceil - beat.progress || 1;
  return THREE.MathUtils.clamp(1 - (progress - beat.progress) / span, 0, 1);
}

/** Shared depth-layer rig for one beat, once its texture is resolved. */
function BeatLayers({ beat, index, texture }: { beat: StoryBeat; index: number; texture: THREE.Texture }) {
  const bgMat = useRef<THREE.MeshBasicMaterial>(null);
  const midMat = useRef<THREE.MeshBasicMaterial>(null);
  const midMesh = useRef<THREE.Mesh>(null);
  const veilMat = useRef<THREE.MeshBasicMaterial>(null);
  const tintColor = useMemo(() => new THREE.Color(beat.tint), [beat.tint]);

  useFrame((state) => {
    const progress = useScrollProgress.getState().progress;
    const w = beatWeight(progress, index);
    if (bgMat.current) bgMat.current.opacity = w;
    if (midMat.current) midMat.current.opacity = w * 0.85;
    if (veilMat.current) veilMat.current.opacity = w * 0.18;
    if (midMesh.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.06 + index * 1.7) * 0.12;
      const scrollDrift = (progress - beat.progress) * beat.parallax * -5;
      midMesh.current.position.x = beat.parallax * breathe + scrollDrift;
    }
  });

  return (
    <group>
      {/* Background: wide curved cyclorama — the environment itself */}
      <mesh position={[0, 0.4, -7.5]} renderOrder={0}>
        <cylinderGeometry
          args={[CYCLORAMA_RADIUS, CYCLORAMA_RADIUS, 6.5, 48, 1, true, -CYCLORAMA_ARC / 2, CYCLORAMA_ARC]}
        />
        <meshBasicMaterial
          ref={bgMat}
          map={texture}
          color={tintColor}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Midground: framed "window" plane, drifts independently for parallax */}
      <mesh ref={midMesh} position={[0, 0.1, -3.2]} renderOrder={1}>
        <planeGeometry args={[3.4, 2]} />
        <meshBasicMaterial
          ref={midMat}
          map={texture}
          color={tintColor}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Veil: near-transparent atmosphere card between midground and hero props */}
      <mesh position={[0, 0, -1.8]} renderOrder={2}>
        <planeGeometry args={[9, 5.4]} />
        <meshBasicMaterial
          ref={veilMat}
          color={tintColor}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function VideoBeat({ beat, index }: { beat: StoryBeat; index: number }) {
  const texture = useVideoTexture(beat.src, { muted: true, loop: true, start: true, playsInline: true });
  texture.colorSpace = THREE.SRGBColorSpace;
  return <BeatLayers beat={beat} index={index} texture={texture} />;
}

function ImageBeat({ beat, index }: { beat: StoryBeat; index: number }) {
  const texture = useTexture(beat.src);
  texture.colorSpace = THREE.SRGBColorSpace;
  return <BeatLayers beat={beat} index={index} texture={texture} />;
}

export function StoryboardLayers() {
  const [active, setActive] = useState<number[]>(() => activeWindow(nearestBeatIndex(0)));

  useFrame(() => {
    const progress = useScrollProgress.getState().progress;
    const win = activeWindow(nearestBeatIndex(progress));
    setActive((prev) => (sameWindow(prev, win) ? prev : win));
  });

  return (
    <group>
      {active.map((i) => {
        const beat = STORY_BEATS[i];
        return (
          <BeatErrorBoundary key={beat.id}>
            <Suspense fallback={null}>
              {beat.type === "video" ? (
                <VideoBeat beat={beat} index={i} />
              ) : (
                <ImageBeat beat={beat} index={i} />
              )}
            </Suspense>
          </BeatErrorBoundary>
        );
      })}
    </group>
  );
}
