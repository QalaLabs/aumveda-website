"use client";

import { create } from "zustand";

interface ScrollState {
  /** Normalized 0–1 progress across the entire homepage scroll experience. */
  progress: number;
  /** Raw scroll velocity from Lenis, used for subtle motion-blur / drift cues. */
  velocity: number;
  reducedMotion: boolean;
  setProgress: (progress: number, velocity: number) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useScrollProgress = create<ScrollState>((set) => ({
  progress: 0,
  velocity: 0,
  reducedMotion: false,
  setProgress: (progress, velocity) => set({ progress, velocity }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
