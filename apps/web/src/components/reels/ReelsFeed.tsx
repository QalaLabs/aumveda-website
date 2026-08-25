"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import type { ReelWithStats } from "@/lib/reels";

interface ReelsFeedProps {
  reels: ReelWithStats[];
}

export default function ReelsFeed({ reels }: ReelsFeedProps) {
  if (reels.length === 0) {
    return (
      <div className="av-content av-gutter py-20 text-center">
        <p className="text-mute">
          No reels published yet. Check back soon — or{" "}
          <Link href="/reels/submit" className="text-gold underline underline-offset-4">
            submit your own
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-10 py-10 md:max-w-lg">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}

function ReelCard({ reel }: { reel: ReelWithStats }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastReportedRef = useRef(0);
  const hasLoggedRef = useRef(false);

  const reportView = useCallback(
    (completionPercent: number) => {
      // Avoid spamming the endpoint — only report meaningful forward progress.
      if (completionPercent - lastReportedRef.current < 10 && completionPercent < 100) return;
      lastReportedRef.current = completionPercent;
      hasLoggedRef.current = true;

      const payload = JSON.stringify({ completionPercent });
      const url = `/api/reels/${reel.id}/view`;

      // sendBeacon survives navigation/unmount; fall back to fetch otherwise.
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    },
    [reel.id]
  );

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    const pct = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
    // Throttle: only report every ~10% of progress.
    if (pct >= lastReportedRef.current + 10) {
      reportView(pct);
    }
  }, [reportView]);

  const handleEnded = useCallback(() => {
    reportView(100);
  }, [reportView]);

  useEffect(() => {
    // Report whatever progress was made if the viewer scrolls away / unmounts.
    return () => {
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) return;
      const pct = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
      if (pct > 0 && !hasLoggedRef.current) {
        reportView(pct);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="overflow-hidden rounded-3xl border border-stone bg-night">
      <div className="relative aspect-[9/16] w-full bg-ink">
        {/* TODO: replace with Mux player */}
        <video
          ref={videoRef}
          src={reel.muxAssetId}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPause={() => {
            const video = videoRef.current;
            if (!video || !video.duration || Number.isNaN(video.duration)) return;
            const pct = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
            if (pct > 0) reportView(pct);
          }}
        >
          Your browser does not support embedded video.
        </video>
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-parchment">
          <Play className="h-3 w-3" aria-hidden />
          {reel.durationSeconds}s
        </div>
      </div>

      <div className="space-y-2 px-5 py-4">
        <h2 className="font-serif text-lg leading-snug text-parchment">{reel.title}</h2>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
          {reel.creatorHandle ? `@${reel.creatorHandle}` : reel.creatorName} · {reel.healingModality}
        </p>
        {reel.chakraTag && (
          <p className="text-xs text-[hsl(var(--av-parchment)/0.5)]">Chakra focus: {reel.chakraTag}</p>
        )}
      </div>
    </article>
  );
}
