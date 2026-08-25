import { prisma } from '@aumveda/db'

export const REEL_CONTENT_TYPE = 'reel'

export interface ReelWithStats {
  id: string
  title: string
  creatorName: string
  creatorHandle: string | null
  muxAssetId: string
  healingModality: string
  profileTags: string[]
  chakraTag: string | null
  durationSeconds: number
  publishedAt: Date | null
  createdAt: Date
  viewCount: number
}

/**
 * Loads every published reel along with a computed view count
 * (Reel has no viewCount column — popularity is derived from ContentView rows).
 */
export async function getPublishedReelsWithStats(): Promise<ReelWithStats[]> {
  const [reels, viewCounts] = await Promise.all([
    prisma.reel.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.contentView.groupBy({
      by: ['contentId'],
      where: { contentType: REEL_CONTENT_TYPE },
      _count: { _all: true },
    }),
  ])

  const countByReelId = new Map(viewCounts.map((v) => [v.contentId, v._count._all]))

  return reels.map((reel) => ({
    id: reel.id,
    title: reel.title,
    creatorName: reel.creatorName,
    creatorHandle: reel.creatorHandle,
    muxAssetId: reel.muxAssetId,
    healingModality: reel.healingModality,
    profileTags: reel.profileTags,
    chakraTag: reel.chakraTag,
    durationSeconds: reel.durationSeconds,
    publishedAt: reel.publishedAt,
    createdAt: reel.createdAt,
    viewCount: countByReelId.get(reel.id) ?? 0,
  }))
}

/**
 * Fetches the portal personalization signals (chakra + profile result) for a
 * logged-in user, if they have completed the portal.
 */
export async function getViewerPersonalizationTags(
  userId: string | null | undefined
): Promise<{ chakraSelected: string | null; profileResult: string | null } | null> {
  if (!userId) return null

  const portalData = await prisma.userPortalData.findUnique({
    where: { userId },
    select: { chakraSelected: true, profileResult: true },
  })

  if (!portalData) return null
  if (!portalData.chakraSelected && !portalData.profileResult) return null

  return portalData
}

/**
 * Sorts reels for the feed: if the viewer has a known chakra/profile match,
 * matching reels are surfaced first (still ranked by popularity within that
 * group), followed by the rest ranked by popularity. Anonymous / non-matching
 * viewers simply get the most popular reels first.
 */
export function sortReelsForViewer(
  reels: ReelWithStats[],
  personalization: { chakraSelected: string | null; profileResult: string | null } | null
): ReelWithStats[] {
  const byPopularity = [...reels].sort((a, b) => b.viewCount - a.viewCount)

  if (!personalization) return byPopularity

  const { chakraSelected, profileResult } = personalization

  const matches = (reel: ReelWithStats) =>
    (!!chakraSelected && reel.chakraTag === chakraSelected) ||
    (!!profileResult && reel.profileTags.includes(profileResult))

  const matched = byPopularity.filter(matches)
  const rest = byPopularity.filter((reel) => !matches(reel))

  return [...matched, ...rest]
}
