"use client";

import { Suspense, useRef, useState, useEffect, type Ref } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { BloomEffect, VignetteEffect } from "postprocessing";
import * as THREE from "three";
import { CameraController } from "./CameraController";
import { EnvironmentDirector } from "./EnvironmentDirector";
import { FloatingObject } from "./MotionObjects";
import { GlassFlask, CopperBowl, GlassOrb, TravertineSlab } from "./assets/models";
import { MasterFilm } from "./MasterFilm";
import { useEnvironment } from "./useEnvironment";
import { useScrollProgress } from "./useScrollProgress";

/** Reads particleOpacity from the environment store at a coarse, throttled
 * granularity (rounded to the nearest 0.05) so Sparkles only re-renders a
 * handful of times across the whole scroll instead of every frame. */
function ParticleField() {
  const opacity = useEnvironment((s) => Math.round(s.particleOpacity * 20) / 20);
  return <Sparkles count={60} scale={[8, 4, 6]} size={1.6} speed={0.15} opacity={opacity} color="#f4e3c8" />;
}

/** The two warm rim/fill lights, boosted by `productGlow` during the
 * product-reveal and copper-reflection chapters — the only place the scene
 * pushes extra light, so it reads as the hero prop catching the light at
 * exactly its moment, not a generic sparkle running the whole film. */
function ProductGlowLights() {
  const rimRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const glow = useEnvironment.getState().productGlow;
    if (rimRef.current) rimRef.current.intensity = 18 + glow * 26;
    if (fillRef.current) fillRef.current.intensity = 10 + glow * 16;
  });

  return (
    <>
      <pointLight ref={rimRef} position={[-2, 1.4, -2.5]} intensity={18} color="#f4c98a" distance={9} decay={2} />
      <pointLight ref={fillRef} position={[2.4, 0.6, -1.5]} intensity={10} color="#d98f52" distance={8} decay={2} />
    </>
  );
}

function SceneContents() {
  const fogRef = useRef<THREE.FogExp2>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      <EnvironmentDirector />
      <fogExp2 ref={fogRef} attach="fog" args={["#0d0a17", 0.03]} />
      <ambientLight intensity={0.35} color="#e8d9c0" />
      <directionalLight
        ref={lightRef}
        position={[3, 4, 2]}
        intensity={1.4}
        color="#f4e3c8"
        castShadow={false}
      />
      <hemisphereLight args={["#3a3350", "#0a0812", 0.4]} />
      {/* Warm rim/backlight so the transmissive glass reads with an edge, echoing the film's god-rays */}
      <ProductGlowLights />

      <CameraController fogRef={fogRef} lightRef={lightRef} />

      <TravertineSlab />

      <FloatingObject position={[-1.1, 0.3, -0.4]} phase={0}>
        <GlassFlask scale={0.9} />
      </FloatingObject>
      <FloatingObject position={[1.2, 0.6, -1]} phase={1.4} speed={0.28}>
        <GlassFlask scale={0.6} />
      </FloatingObject>
      <FloatingObject position={[0.1, -0.1, 0.4]} phase={2.6} speed={0.22}>
        <CopperBowl scale={1.1} />
      </FloatingObject>
      <FloatingObject position={[-1.8, -0.5, 0.8]} phase={3.3} speed={0.4}>
        <GlassOrb scale={0.7} />
      </FloatingObject>
      <FloatingObject position={[2, -0.6, -0.6]} phase={0.8} speed={0.3}>
        <GlassOrb scale={0.45} />
      </FloatingObject>

      <ParticleField />
    </>
  );
}

/** Mutates the Bloom/Vignette effect instances directly every frame from
 * EnvironmentDirector's numbers — no React re-render involved, same
 * zero-overhead pattern StoryboardLayers uses for its material opacity. */
function GradedEffects() {
  const bloomRef = useRef<BloomEffect>(null);
  const vignetteRef = useRef<VignetteEffect>(null);

  useFrame(() => {
    const env = useEnvironment.getState();
    if (bloomRef.current) bloomRef.current.intensity = env.bloomIntensity;
    if (vignetteRef.current) vignetteRef.current.darkness = env.vignetteDarkness;
  });

  return (
    <EffectComposer multisampling={0}>
      {/* @react-three/postprocessing types its ref prop as `typeof BloomEffect`
          (the constructor) rather than an instance — a known upstream typing
          gap. The runtime ref is a real BloomEffect instance; cast to match. */}
      {/* Was intensity 0.4 / vignette darkness 0.9 — stacked with the DOM
          .av-vignette overlay this read as heavy haze over the whole frame
          ("smoke machine" critique). Cut roughly in half so the master
          film's own light stays legible; EnvironmentDirector's productGlow
          bump still reads clearly on top of this lower floor. */}
      <Bloom
        ref={bloomRef as unknown as Ref<typeof BloomEffect>}
        intensity={0.22}
        luminanceThreshold={0.78}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette
        ref={vignetteRef as unknown as Ref<typeof VignetteEffect>}
        eskil={false}
        offset={0.32}
        darkness={0.5}
      />
    </EffectComposer>
  );
}

/**
 * Persistent, fixed, full-viewport layer stack that lives behind every
 * homepage section: the 30s master film (MasterFilm) as the environment
 * itself, with a transparent R3F canvas composited on top for fog, dust,
 * the floating logo, and the hero props (flask/bowl/orb/slab). Never
 * unmounts between sections. The film's own authored camera is respected —
 * CameraController only adds subtle sympathetic drift to the props on top
 * of it now, not an independent "shot" (see CameraController's DRIFT_SCALE).
 */
export function SceneCanvas() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useScrollProgress((s) => s.reducedMotion);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full bg-[hsl(var(--av-ink))]"
    >
      <MasterFilm />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6.4], fov: 38, near: 0.1, far: 40 }}
        frameloop={reducedMotion ? "demand" : "always"}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
        {/* Filmic grade — bloom/vignette intensity driven by EnvironmentDirector
            (warms at temple/lab/sunrise, deepens through transitions). DepthOfField
            is intentionally omitted: @react-three/postprocessing's DoF pass
            requires three >=0.168 and this repo pins three@^0.166, which
            corrupts the WebGL framebuffer state (glBlitFramebuffer errors)
            and silently stalls every other texture upload in the canvas.
            Revisit once the three dependency is bumped. Skipped entirely
            under reduced-motion so low-power/accessibility users get the
            plain render rather than extra composite passes. */}
        {!reducedMotion && <GradedEffects />}
      </Canvas>
      {/* Grain + vignette keep the render feeling filmic rather than gamey */}
      <div className="av-grain av-vignette pointer-events-none absolute inset-0" />
    </div>
  );
}
