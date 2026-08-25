"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";

const CHAKRAS = [
  "Root",
  "Sacral",
  "Solar Plexus",
  "Heart",
  "Throat",
  "Third Eye",
  "Crown",
];

export default function SubmitReelPage() {
  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [muxAssetId, setMuxAssetId] = useState("");
  const [healingModality, setHealingModality] = useState("");
  const [chakraTag, setChakraTag] = useState("");
  const [profileTagsInput, setProfileTagsInput] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("30");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          creatorName,
          creatorHandle: creatorHandle || undefined,
          muxAssetId,
          healingModality,
          chakraTag: chakraTag || undefined,
          profileTags: profileTagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          durationSeconds: Number(durationSeconds) || 30,
        }),
      });

      if (res.status === 401) {
        throw new Error("Please log in to submit a reel.");
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div data-surface="parchment" className="min-h-screen bg-parchment text-ink-text">
        <div className="av-content av-gutter py-32 text-center">
          <CheckCircle2 className="mx-auto mb-6 h-12 w-12 text-gold" aria-hidden />
          <h1 className="av-title text-night">Thank you.</h1>
          <p className="av-lede mx-auto mt-4 max-w-md text-mute">
            Your reel has been submitted for review. Our team will publish it
            once it&apos;s approved.
          </p>
          <Link href="/reels" className="av-cta mt-10 inline-flex">
            Back to Reels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-surface="parchment" className="min-h-screen bg-parchment texture-paper text-ink-text">
      <div className="av-content av-gutter pt-28 pb-24 md:pt-36">
        <p className="av-eyebrow-ink mb-4 text-gold">Reels · Submit</p>
        <h1 className="av-display max-w-[18ch] text-night">Share your practice.</h1>
        <p className="av-lede mt-6 max-w-[55ch] text-mute">
          Submit a short healing reel for review. Approved reels are published
          to the public Reels feed.
        </p>

        <form onSubmit={handleSubmit} className="mt-14 max-w-xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="3-minute grounding ritual for the root chakra"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="creatorName">Your name</Label>
              <Input
                id="creatorName"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creatorHandle">Handle (optional)</Label>
              <Input
                id="creatorHandle"
                value={creatorHandle}
                onChange={(e) => setCreatorHandle(e.target.value)}
                maxLength={60}
                placeholder="yourname"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="muxAssetId">Video URL</Label>
            {/* TODO: replace with a proper Mux direct-upload flow */}
            <Input
              id="muxAssetId"
              value={muxAssetId}
              onChange={(e) => setMuxAssetId(e.target.value)}
              required
              placeholder="https://…/your-video.mp4"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="healingModality">Healing modality</Label>
              <Input
                id="healingModality"
                value={healingModality}
                onChange={(e) => setHealingModality(e.target.value)}
                required
                maxLength={120}
                placeholder="Somatic breathwork"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationSeconds">Duration (seconds)</Label>
              <Input
                id="durationSeconds"
                type="number"
                min={1}
                max={3600}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chakraTag">Chakra focus (optional)</Label>
            <select
              id="chakraTag"
              value={chakraTag}
              onChange={(e) => setChakraTag(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">None</option>
              {CHAKRAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileTags">Profile tags (optional, comma-separated)</Label>
            <Textarea
              id="profileTags"
              value={profileTagsInput}
              onChange={(e) => setProfileTagsInput(e.target.value)}
              placeholder="anxious-achiever, seeker, overthinker"
              rows={2}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit for review"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
