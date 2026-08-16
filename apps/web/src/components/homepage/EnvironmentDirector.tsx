"use client";

import { useFrame } from "@react-three/fiber";
import { STORY_BEATS } from "./timeline";
import { useScrollProgress } from "./useScrollProgress";
import { useEnvironment } from "./useEnvironment";

/**
 * EnvironmentDirector — the one system atmosphere comes from.
 *
 * Owns nothing visual itself (no meshes, no lights) — it only computes, once
 * per frame, the numbers that make the master film (MasterFilm.tsx, the
 * 30s single source of truth) feel enhanced rather than decorated: idle
 * camera breathing, fog/bloom/vignette/dust/glow that track which chapter
 * of the film is currently playing, and how visible the wordmark/hero props
 * should be at that moment.
 *
 * Everything it computes is written to `useEnvironment` — CameraController
 * and SceneCanvas's postprocessing read from that store rather than each
 * inventing their own atmosphere logic.
 *
 * IMPORTANT — this is Creative Polish, not architecture: these curves only
 * ever adjust light/fog/particle/glow numbers layered *on top of* the film.
 * They never gate what plays, never cut, never introduce a seam of their
 * own. Since the film has no clip boundaries anymore (StoryboardLayers'
 * crossfade system is retired), transitionPulse below is intentionally
 * subtle — a hard pulse here would itself read as an "obvious transition,"
 * which is exactly what this phase is meant to eliminate, not add.
 */

// Hand-authored per-chapter curves, indexed to STORY_BEATS' 7 entries
// (arrival → threshold → laboratory → product → ritual → copper-reflection
// → sunrise) — one value per chapter of the master film, matched to what
// that second of footage is actually showing.
//                                  arrival  threshold  lab   product  ritual  reflection  sunrise
const WARMTH_BY_BEAT       =        [0.12,    0.55,     0.55,  0.85,   0.4,    0.75,       1.0];
const DUST_BY_BEAT         =        [0.25,    0.5,      0.35,  0.2,    0.45,   0.3,        0.2];
// Extra glow on the warm rim/fill lights specifically at the two beats
// where the hero product is the point of the shot (the platform/copper-bowl
// morph, and its warmer reflection pass) — everywhere else stays at 0 so it
// never competes with the film.
const PRODUCT_GLOW_BY_BEAT =        [0,       0,        0.1,   1.0,    0,      0.6,        0.15];
// Wordmark visibility: present on arrival (orienting the visitor), recedes
// through the mid-film chapters so the film carries the scene uninterrupted,
// returns at the sunrise/CTA close. Not a hard cut — FloatingNav still tweens.
const LOGO_OPACITY_BY_BEAT =        [1.0,     0.55,     0.35,  0.3,    0.35,   0.5,        0.9];

/** Linear-interpolate a per-beat value array across STORY_BEATS' progress points. */
function sampleByBeat(progress: number, values: number[]) {
  const beats = STORY_BEATS;
  for (let i = 0; i < beats.length - 1; i++) {
    const a = beats[i];
    const b = beats[i + 1];
    if (progress >= a.progress && progress <= b.progress) {
      const span = b.progress - a.progress || 1;
      const t = (progress - a.progress) / span;
      return values[i] + (values[i + 1] - values[i]) * t;
    }
  }
  return progress <= beats[0].progress ? values[0] : values[values.length - 1];
}

/** Bump function peaking at 1 exactly at each beat's midpoint to its neighbor, 0 at either beat — drives the "thicken then clear" transition. */
function transitionPulse(progress: number) {
  const beats = STORY_BEATS;
  let best = 0;
  for (let i = 0; i < beats.length - 1; i++) {
    const a = beats[i].progress;
    const b = beats[i + 1].progress;
    if (progress >= a && progress <= b) {
      const mid = (a + b) / 2;
      const halfSpan = (b - a) / 2 || 1;
      const dist = Math.abs(progress - mid) / halfSpan; // 0 at mid, 1 at either edge
      best = Math.max(best, 1 - dist);
    }
  }
  return best;
}

export function EnvironmentDirector() {
  useFrame((state) => {
    const progress = useScrollProgress.getState().progress;
    const velocity = useScrollProgress.getState().velocity;
    const t = state.clock.elapsedTime;

    // Idle breathing — slow, low-amplitude, different frequencies per axis
    // so it never reads as mechanical. Velocity adds a touch of extra sway,
    // like a Steadicam absorbing footsteps rather than floating in a vacuum.
    const sway = Math.min(1, Math.abs(velocity) * 0.4);
    const driftX = Math.sin(t * 0.11) * 0.05 + Math.sin(t * 0.037) * sway * 0.03;
    const driftY = Math.sin(t * 0.08 + 1.3) * 0.035;
    const driftZ = Math.sin(t * 0.05 + 2.1) * 0.04;
    const lookDriftX = Math.sin(t * 0.09 + 0.6) * 0.02;
    const lookDriftY = Math.sin(t * 0.065 + 2.4) * 0.015;

    const pulse = transitionPulse(progress);
    const warmth = sampleByBeat(progress, WARMTH_BY_BEAT);
    const dust = sampleByBeat(progress, DUST_BY_BEAT);
    const productGlow = sampleByBeat(progress, PRODUCT_GLOW_BY_BEAT);
    const logoOpacity = sampleByBeat(progress, LOGO_OPACITY_BY_BEAT);

    useEnvironment.getState().setEnvironment({
      driftX,
      driftY,
      driftZ,
      lookDriftX,
      lookDriftY,
      // Barely-there now — there is no clip seam left to mask (the film has
      // none), so this is just a faint breath at each chapter's midpoint,
      // not the seam-hiding spike it used to be.
      fogPulse: 1 + pulse * 0.12,
      // Floors halved (were 0.28/0.82/0.18) — the film is the environment;
      // these should read as a gentle grade on top of it, not a haze that
      // competes with it. See "fog too dominant" critique.
      bloomIntensity: 0.14 + warmth * 0.18 + productGlow * 0.14,
      vignetteDarkness: 0.42 + pulse * 0.04,
      particleOpacity: 0.09 + dust * 0.16,
      productGlow,
      logoOpacity,
    });
  });

  return null;
}
