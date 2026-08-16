import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

/**
 * Portal write endpoint — the single, canonical persistence path.
 *
 * Anonymous-until-Step-6 flow:
 *  - Steps 1–5: browser holds partial data in localStorage; the server sees nothing
 *    (nothing here to write yet, no user).
 *  - Step 6: browser POSTs {email, dob, ...portalData} — server upserts a User by
 *    email (idempotent for portal re-runs) and creates/updates UserPortalData with
 *    everything accumulated so far. Returns userId to the client.
 *  - Steps 7–8: browser POSTs {sessionId, userId, portalData} — server upserts
 *    UserPortalData scoped to that userId.
 *
 * This deliberately trusts the client-supplied userId once returned. Real auth
 * arrives with Supabase magic-link post-portal per PRD Section 6.1; until then
 * the lead-capture surface is inherently open, matching the PRD's Phase-0 design.
 */

const portalDataSchema = z
  .object({
    chakraSelected: z.string().max(32).optional().nullable(),
    archetypeSelected: z.string().max(32).optional().nullable(),
    tarotCard: z.string().max(64).optional().nullable(),
    tarotTheme: z.string().max(32).optional().nullable(),
    intention: z.string().max(1000).optional().nullable(),
    dob: z.string().max(32).optional().nullable(),
    timeOfBirth: z.string().max(16).optional().nullable(),
    placeOfBirth: z.string().max(200).optional().nullable(),
    birthLat: z.number().optional().nullable(),
    birthLng: z.number().optional().nullable(),
    sunSign: z.string().max(32).optional().nullable(),
    moonSign: z.string().max(32).optional().nullable(),
    risingSign: z.string().max(32).optional().nullable(),
    email: z.string().email().max(320).optional().nullable(),
    q1Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q2Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q3Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q4Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q5Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q6Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    q7Answer: z.enum(['A', 'B', 'C', 'D']).optional().nullable(),
    nervousSystemScore: z.string().max(32).optional().nullable(),
    relationshipScore: z.string().max(32).optional().nullable(),
    childhoodScore: z.string().max(32).optional().nullable(),
    financialScore: z.string().max(32).optional().nullable(),
    profileResult: z.string().max(32).optional().nullable(),
    portalCompletedAt: z.string().max(32).optional().nullable(),
  })
  // Strip unknown client fields (archetypeGift, tarotSeed, etc.) — do not .strict()
  // or Step 3+ autosave POSTs reject with 400 and never mint a lead userId.

const requestSchema = z.object({
  sessionId: z.string().min(4).max(128),
  userId: z.string().min(1).max(64).optional().nullable(),
  portalData: portalDataSchema,
})

const PORTAL_FIELDS = [
  'chakraSelected',
  'archetypeSelected',
  'tarotCard',
  'tarotTheme',
  'q1Answer',
  'q2Answer',
  'q3Answer',
  'q4Answer',
  'q5Answer',
  'q6Answer',
  'q7Answer',
  'nervousSystemScore',
  'relationshipScore',
  'childhoodScore',
  'financialScore',
  'profileResult',
] as const

type UserPortalDataFieldSubset = Partial<
  Pick<
    {
      chakraSelected: string
      archetypeSelected: string
      tarotCard: string
      tarotTheme: string
      intentionText: string
      q1Answer: string
      q2Answer: string
      q3Answer: string
      q4Answer: string
      q5Answer: string
      q6Answer: string
      q7Answer: string
      nervousSystemScore: string
      relationshipScore: string
      childhoodScore: string
      financialScore: string
      profileResult: string
      portalCompletedAt: Date
    },
    | 'chakraSelected'
    | 'archetypeSelected'
    | 'tarotCard'
    | 'tarotTheme'
    | 'intentionText'
    | 'q1Answer'
    | 'q2Answer'
    | 'q3Answer'
    | 'q4Answer'
    | 'q5Answer'
    | 'q6Answer'
    | 'q7Answer'
    | 'nervousSystemScore'
    | 'relationshipScore'
    | 'childhoodScore'
    | 'financialScore'
    | 'profileResult'
    | 'portalCompletedAt'
  >
>

function projectPortalData(
  data: z.infer<typeof portalDataSchema>,
): UserPortalDataFieldSubset {
  const out: UserPortalDataFieldSubset = {}
  for (const key of PORTAL_FIELDS) {
    const val = data[key]
    if (val !== undefined && val !== null) {
      // Assignments are type-narrowed via the pick above; the runtime shape is validated by Zod.
      ;(out as Record<string, string>)[key] = val
    }
  }
  if (data.intention !== undefined && data.intention !== null) {
    out.intentionText = data.intention
  }
  if (data.portalCompletedAt !== undefined && data.portalCompletedAt !== null) {
    out.portalCompletedAt = new Date(data.portalCompletedAt)
  }
  return out
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const { sessionId, portalData } = parsed.data
    let userId = parsed.data.userId ?? null

    // Step 6 email-capture branch: upsert the user by email (idempotent for
    // duplicate portal runs) and stamp the birth-chart fields on `users`.
    if (portalData.email) {
      const user = await prisma.user.upsert({
        where: { email: portalData.email.toLowerCase() },
        update: {
          dob: portalData.dob ? new Date(portalData.dob) : undefined,
          birthLat: portalData.birthLat ?? undefined,
          birthLng: portalData.birthLng ?? undefined,
          placeOfBirth: portalData.placeOfBirth ?? undefined,
          timeOfBirth: portalData.timeOfBirth ?? undefined,
          sunSign: portalData.sunSign ?? undefined,
          moonSign: portalData.moonSign ?? undefined,
          risingSign: portalData.risingSign ?? undefined,
        },
        create: {
          email: portalData.email.toLowerCase(),
          dob: portalData.dob ? new Date(portalData.dob) : null,
          birthLat: portalData.birthLat ?? null,
          birthLng: portalData.birthLng ?? null,
          placeOfBirth: portalData.placeOfBirth ?? null,
          timeOfBirth: portalData.timeOfBirth ?? null,
          sunSign: portalData.sunSign ?? null,
          moonSign: portalData.moonSign ?? null,
          risingSign: portalData.risingSign ?? null,
        },
      })
      userId = user.id
    }

    if (!userId) {
      // No user yet — pre-Step-6 anonymous save. Nothing to persist server-side; the
      // client keeps everything in localStorage until email capture at Step 6.
      return NextResponse.json({ ok: true, userId: null })
    }

    const updateData = projectPortalData(portalData)

    await prisma.userPortalData.upsert({
      where: { userId },
      update: updateData,
      create: { userId, ...updateData },
    })

    // Server-side portal step event for the audit trail; the client tracker also
    // fires an analytics event via the AnalyticsTracker abstraction.
    await prisma.event.create({
      data: {
        eventName: portalData.portalCompletedAt ? 'portal.completed' : 'portal.step_completed',
        userId,
        payload: {
          sessionId,
          fields: Object.keys(updateData),
        },
        source: 'server',
      },
    })

    return NextResponse.json({ ok: true, userId })
  } catch (error) {
    console.error('[api/portal] Server error:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Authenticated owner-only read. The portal POST flow is intentionally open
  // (lead capture), but reading back a user's full portal data (birth details,
  // scores, profile result) must not be possible by guessing a userId.
  const { getServerSession } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'userId required' }, { status: 400 })
  }
  if (userId !== session.user.id) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  }
  const data = await prisma.userPortalData.findUnique({ where: { userId } })
  return NextResponse.json({ ok: true, data })
}
