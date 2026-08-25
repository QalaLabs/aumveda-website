import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  creatorName: z.string().min(1).max(120),
  creatorHandle: z.string().max(60).optional().nullable(),
  muxAssetId: z.string().min(1), // TODO: replace with real Mux upload/asset id once the Mux pipeline is wired up
  healingModality: z.string().min(1).max(120),
  profileTags: z.array(z.string().min(1)).max(10).optional().default([]),
  chakraTag: z.string().max(60).optional().nullable(),
  durationSeconds: z.number().int().positive().max(3600),
})

/**
 * Creator submission — every reel is created unpublished (isPublished: false,
 * approvedBy: null) and must go through the admin approval queue at
 * /admin/reels before it is visible on the public feed.
 */
export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const {
      title,
      creatorName,
      creatorHandle,
      muxAssetId,
      healingModality,
      profileTags,
      chakraTag,
      durationSeconds,
    } = parsed.data

    const reel = await prisma.reel.create({
      data: {
        title,
        creatorName,
        creatorHandle: creatorHandle || null,
        muxAssetId,
        healingModality,
        profileTags,
        chakraTag: chakraTag || null,
        durationSeconds,
        isPublished: false,
        publishedAt: null,
        approvedBy: null,
      },
    })

    return NextResponse.json({ ok: true, data: reel }, { status: 201 })
  } catch (e) {
    console.error('REELS POST ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
