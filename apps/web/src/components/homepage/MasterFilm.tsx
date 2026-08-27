"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "./useScrollProgress";

const FILM_SRC = "/story/master-film.mp4";
const FILM_DURATION = 30; // seconds — confirmed via the file's mvhd atom (timescale 1000, duration 30000)

/**
 * MasterFilm — the 30s Flow-rendered cinematic (`aumveedaa.mp4`) as the
 * homepage's environment. This is the single source of truth for the visual
 * journey: scroll does not swap between clips or crossfade planes (that was
 * the V3 StoryboardLayers approach, now archived) — it scrubs one
 * continuous, already-authored camera move.
 *
 * Two things make scroll-scrubbing a native <video> feel good instead of
 * janky, both hard-won lessons from the scroll-world skill:
 *  1. Fetch as a Blob and play from an object URL. Many hosts (and any dev
 *     server that doesn't serve byte-range requests) pin `video.seekable`
 *     to [0,0], which clamps every seek to frame 0. A blob is always fully
 *     seekable regardless of host.
 *  2. Seek-coalesce. Never assign `currentTime` while a previous seek is
 *     still resolving (`video.seeking === true`) — queuing seeks faster
 *     than the decoder can service them is what makes fast scrolling look
 *     frozen or stuttery. The rAF loop below re-reads the latest target
 *     every frame, so a coalesced seek is never stale, just deferred one
 *     frame.
 *
 * The target time itself is damped (not assigned raw) so normal scroll
 * reads as a camera drifting through the film, not a slideshow of frames.
 *
 * Load / failure behavior: no mid-film still as `poster` (that flashed a
 * warm ritual photo over the cold opening and read as a glitch). Until the
 * first decoded frame is ready — or if the film is unreachable — the
 * parent SceneCanvas ink fill holds the frame. Video fades in once ready.
 */
export function MasterFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothedTime = useRef(0);
  const rafRef = useRef<number>(0);
  const blobUrlRef = useRef<string | null>(null);
  const [filmUnavailable, setFilmUnavailable] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Set direct source as instant fallback while blob is fetching
    if (videoRef.current) {
      videoRef.current.src = FILM_SRC;
    }

    fetch(FILM_SRC)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`master-film responded ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        if (videoRef.current) {
          videoRef.current.src = url;
        }
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[MasterFilm] blob fetch fallback active:", err);
        }
      });

    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const progress = useScrollProgress.getState().progress;
        const target = progress * FILM_DURATION;
        // Critically-damped approach to the target time — a raw assignment
        // every scroll tick reads as a slideshow; this reads as a scrub.
        smoothedTime.current += (target - smoothedTime.current) * 0.12;
        // Seek-coalescing: only hand the decoder a new time once it has
        // finished the last one.
        if (!video.seeking && Math.abs(video.currentTime - smoothedTime.current) > 0.02) {
          video.currentTime = smoothedTime.current;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleError = () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[MasterFilm] film failed to decode, holding ink stage");
    }
    setFilmUnavailable(true);
  };

  const handleLoadedData = () => {
    // Seek to the current scroll position before revealing so we never flash
    // an intermediate decoder frame over the hero.
    const video = videoRef.current;
    if (video) {
      const progress = useScrollProgress.getState().progress;
      const t = progress * FILM_DURATION;
      smoothedTime.current = t;
      try {
        video.currentTime = t;
      } catch {
        // Some browsers reject seeks before HAVE_METADATA; loadeddata means
        // we usually have it — ignore and let the rAF loop catch up.
      }
    }
    setFrameReady(true);
  };

  if (filmUnavailable) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onError={handleError}
      className={`pointer-events-none fixed inset-0 z-0 h-[100svh] w-full object-cover transition-opacity duration-700 ease-out ${
        frameReady ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
