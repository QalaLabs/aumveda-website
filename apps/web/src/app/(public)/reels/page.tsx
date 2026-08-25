import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getPublishedReelsWithStats,
  getViewerPersonalizationTags,
  sortReelsForViewer,
} from "@/lib/reels";
import ReelsFeed from "@/components/reels/ReelsFeed";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://app.aumveda.com";

export const metadata: Metadata = {
  title: "Reels — Bite-Sized Healing Wisdom",
  description:
    "Short-form Neuro-Vedic healing reels from Aumveda practitioners and creators — chakra work, somatic practice, and Vedic wisdom in under a minute.",
  openGraph: {
    title: "Reels — Aumveda",
    description:
      "Short-form Neuro-Vedic healing reels — chakra work, somatic practice, and Vedic wisdom in under a minute.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

/**
 * JSON.stringify + escape "<" so a reel title containing something like
 * "</script><script>" can't break out of the inline <script> tag.
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ReelsPage() {
  const session = await getServerSession(authOptions);
  const [reels, personalization] = await Promise.all([
    getPublishedReelsWithStats(),
    getViewerPersonalizationTags(session?.user?.id),
  ]);

  const sortedReels = sortReelsForViewer(reels, personalization);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": sortedReels.map((reel) => ({
      "@type": "VideoObject",
      "@id": `${BASE_URL}/reels#${reel.id}`,
      name: reel.title,
      description: `${reel.healingModality} reel by ${reel.creatorName}${
        reel.chakraTag ? ` — ${reel.chakraTag} chakra focus` : ""
      }`,
      // TODO: replace with Mux player's real thumbnail/content URL once the player is wired up
      thumbnailUrl: [`${BASE_URL}/reels/${reel.id}/thumbnail`],
      uploadDate: (reel.publishedAt ?? reel.createdAt).toISOString(),
      duration: `PT${reel.durationSeconds}S`,
      contentUrl: reel.muxAssetId,
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/WatchAction",
        userInteractionCount: reel.viewCount,
      },
    })),
  };

  return (
    <div data-surface="night" className="min-h-screen bg-night text-parchment">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="av-content av-gutter pt-28 pb-8 md:pt-36">
        <p className="av-eyebrow-ink mb-4 text-gold">Reels</p>
        <h1 className="av-display max-w-[18ch] text-parchment">Bite-sized healing.</h1>
        <p className="av-lede mt-6 max-w-[55ch] text-[hsl(var(--av-parchment)/0.65)]">
          Short reels from practitioners and creators — chakra work, somatic
          practice, and Vedic wisdom, one swipe at a time.
        </p>
        <Link
          href="/reels/submit"
          className="av-cta mt-8 inline-flex border-[hsl(var(--av-gold)/0.5)]"
        >
          Submit a reel
        </Link>
      </div>

      <ReelsFeed reels={sortedReels} />
    </div>
  );
}
