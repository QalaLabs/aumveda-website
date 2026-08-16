"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CAMERA_KEYFRAMES } from "./timeline";
import { useScrollProgress } from "./useScrollProgress";
import { useEnvironment } from "./useEnvironment";

const posA = new THREE.Vector3();
const posB = new THREE.Vector3();
const lookA = new THREE.Vector3();
const lookB = new THREE.Vector3();
const colorA = new THREE.Color();
const colorB = new THREE.Color();

/** Find the two keyframes surrounding `progress` and the local blend factor between them. */
function findSurrounding(progress: number) {
  const frames = CAMERA_KEYFRAMES;
  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (progress >= a.progress && progress <= b.progress) {
      const span = b.progress - a.progress || 1;
      const t = (progress - a.progress) / span;
      return { a, b, t };
    }
  }
  const last = frames[frames.length - 1];
  return { a: last, b: last, t: 0 };
}

// The R3F camera used to *be* the shot (StoryboardLayers had no baked-in
// camera of its own). Now the master film carries an already-authored
// camera move, so this virtual camera must not compete with it — it only
// nudges the floating props/fog with a fraction of the timeline's authored
// travel, never the full keyframe distance. 1.0 would restore the old
// "camera is the shot" behavior; keep this low.
const CAMERA_DRIFT_SCALE = 0.18;
const REST_POSITION = new THREE.Vector3(0, 0.4, 6.4);
const REST_LOOKAT = new THREE.Vector3(0, 0.1, -2.4);

/**
 * Reads global scroll progress and smoothly interpolates the R3F camera
 * between the timeline's keyframes — position, look-at, FOV, and the
 * scene's fog/light color. This is the only place camera math happens.
 * Position/look-at travel is scaled down (CAMERA_DRIFT_SCALE) so it reads
 * as sympathetic drift on the props, not a second camera fighting the
 * master film's own authored move.
 */
export function CameraController({
  fogRef,
  lightRef,
}: {
  fogRef: React.RefObject<THREE.FogExp2>;
  lightRef: React.RefObject<THREE.DirectionalLight>;
}) {
  const { camera } = useThree();
  const smoothed = useRef(0);

  useFrame((_, delta) => {
    const target = useScrollProgress.getState().progress;
    // Critically-damped smoothing so the camera drifts rather than snaps.
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 2.4);
    const progress = smoothed.current;

    const { a, b, t } = findSurrounding(progress);
    const ease = t * t * (3 - 2 * t); // smoothstep

    posA.set(...a.camera);
    posB.set(...b.camera);
    posA.lerp(posB, ease);

    lookA.set(...a.lookAt);
    lookB.set(...b.lookAt);
    lookA.lerp(lookB, ease);

    // Pull the authored keyframe position/look-at back toward rest by
    // (1 - CAMERA_DRIFT_SCALE) — keeps only a fraction of the travel.
    posA.lerp(REST_POSITION, 1 - CAMERA_DRIFT_SCALE);
    lookA.lerp(REST_LOOKAT, 1 - CAMERA_DRIFT_SCALE);

    camera.position.lerp(posA, 0.08);
    // EnvironmentDirector's idle breathing, layered on top of the scroll-driven
    // position — never changes the underlying interpolation, just rides it.
    const env = useEnvironment.getState();
    camera.position.x += env.driftX;
    camera.position.y += env.driftY;
    camera.position.z += env.driftZ;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(a.camFov, b.camFov, ease);
      camera.updateProjectionMatrix();
    }
    lookA.x += env.lookDriftX;
    lookA.y += env.lookDriftY;
    camera.lookAt(lookA);

    if (fogRef.current) {
      fogRef.current.density = THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, ease) * env.fogPulse;
      colorA.set(a.fogColor);
      colorB.set(b.fogColor);
      colorA.lerp(colorB, ease);
      fogRef.current.color.lerp(colorA, 0.1);
    }
    if (lightRef.current) {
      colorA.set(a.lightColor);
      colorB.set(b.lightColor);
      colorA.lerp(colorB, ease);
      lightRef.current.color.lerp(colorA, 0.1);
    }
  });

  return null;
}
