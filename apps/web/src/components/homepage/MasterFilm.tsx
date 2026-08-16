"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "./useScrollProgress";

const FILM_SRC = "/story/master-film.mp4";
const FILM_DURATION = 30; // seconds — confirmed via the file's mvhd atom (timescale 1000, duration 30000)
// Atmospheric still from the same Flow render pipeline. Only shown while the
// film loads, or in the (rare) case the film itself is unreachable — never a
// blank background.
const FILM_POSTER = "/story/beat5-ritual.jpg";

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
 * Failure behavior: a non-OK response (e.g. 404 if the film is missing) or a
 * decode error swaps the background to a static still. Visitors never see a
 * blank background, a broken video icon, or a raw error.
 */
export function MasterFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothedTime = useRef(0);
  const rafRef = useRef<number>(0);
  const blobUrlRef = useRef<string | null>(null);
  const [filmUnavailable, setFilmUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

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
        // Network hiccup, dev-server restart mid-fetch, or a missing film —
        // fall back to the atmospheric still. Never leave the background
        // blank, never surface an error to the visitor.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[MasterFilm] blob fetch failed, using static fallback:", err);
        }
        if (!cancelled) setFilmUnavailable(true);
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
      console.warn("[MasterFilm] film failed to decode, using static fallback");
    }
    setFilmUnavailable(true);
  };

  if (filmUnavailable) {
    return (
      <img
        src={FILM_POSTER}
        alt=""
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      playsInline
      preload="auto"
      poster={FILM_POSTER}
      onError={handleError}
      className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full object-cover"
    />
  );
}
