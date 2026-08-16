"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOTION_OBJECTS } from "./timeline";

/**
 * Reusable ambient prop: gently bobs and rotates on its own clock, then
 * drifts with scroll velocity for a barely-there parallax. Every floating
 * object in the scene (glass, copper, orb) wraps this — no bespoke motion
 * code per-object.
 */
export function FloatingObject({
  position,
  amplitude = MOTION_OBJECTS.floatAmplitude,
  speed = MOTION_OBJECTS.floatSpeed,
  rotSpeed = MOTION_OBJECTS.rotationSpeed,
  phase = 0,
  children,
}: {
  position: [number, number, number];
  amplitude?: number;
  speed?: number;
  rotSpeed?: number;
  phase?: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime * speed + phase;
    g.position.y = position[1] + Math.sin(t) * amplitude;
    g.position.x = position[0] + Math.cos(t * 0.6) * amplitude * 0.35;
    g.rotation.y += rotSpeed * 0.01;
    g.rotation.z = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group ref={group} position={position}>
      {children}
    </group>
  );
}

// Production geometry (GlassFlask, CopperBowl, GlassOrb, TravertineSlab) has
// moved to ./assets/models.tsx, GLB-backed via ./assets/AssetManager. This
// file now only owns ambient motion — no primitive meshes are defined here.
