"use client";

import { create } from "zustand";

/**
 * useEnvironment — the single store EnvironmentDirector writes into and
 * every other piece of the scene (CameraController, SceneCanvas's
 * postprocessing, StoryboardLayers) reads from. This is the "one system"
 * the atmosphere comes from: nobody else computes drift, bloom, vignette,
 * or fog-pulse independently — they just read the numbers here.
 *
 * Deliberately a plain data store, not a rewrite of any consuming
 * component's own logic — CameraController still owns its own
 * position/fog lerp math, it just adds these values on top.
 */
interface EnvironmentState {
  /** Idle camera drift (world units), layered on top of the scroll-driven position — the "breathing" camera. */
  driftX: number;
  driftY: number;
  driftZ: number;
  /** Idle look-at drift (radians-ish, small), so the camera also breathes its gaze, not just its position. */
  lookDriftX: number;
  lookDriftY: number;
  /** Multiplier applied on top of the interpolated fog density — thickens briefly at each beat's transition midpoint. */
  fogPulse: number;
  /** Bloom intensity, warms slightly at warm-light beats (temple, lab, sunrise). */
  bloomIntensity: number;
  /** Vignette darkness, deepens slightly during transitions to help hide the environment swap. */
  vignetteDarkness: number;
  /** Dust/particle opacity — thicker in temple/corridor fog, thinner in open courtyard/sunrise. */
  particleOpacity: number;
  /** 0–1, peaks during the product-reveal and copper-reflection chapters — extra warm rim-light glow on the hero prop's beat, silent elsewhere. */
  productGlow: number;
  /** 0–1, the wordmark/logo's target opacity for the current chapter — full on arrival and sunrise, recedes while the film carries the scene alone. */
  logoOpacity: number;
  setEnvironment: (partial: Partial<Omit<EnvironmentState, "setEnvironment">>) => void;
}

export const useEnvironment = create<EnvironmentState>((set) => ({
  driftX: 0,
  driftY: 0,
  driftZ: 0,
  lookDriftX: 0,
  lookDriftY: 0,
  fogPulse: 1,
  bloomIntensity: 0.22,
  vignetteDarkness: 0.5,
  particleOpacity: 0.18,
  productGlow: 0,
  logoOpacity: 1,
  setEnvironment: (partial) => set(partial),
}));
