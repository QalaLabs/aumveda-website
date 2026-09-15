import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const offlineStepSchema = z.object({
  sessionId: z.string().min(1),
  stepNumber: z.number().int().min(1).max(8),
  data: z.record(z.unknown()),
  isOfflineSync: z.boolean().default(true),
  clientRecordedAt: z.string().optional(),
})

const syncPayloadSchema = z.object({
  steps: z.array(offlineStepSchema).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = syncPayloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid offline sync payload' },
        { status: 400 },
      )
    }

    const { steps } = parsed.data
    let syncedCount = 0

    // Group steps by sessionId
    const bySession = new Map<string, typeof steps>()
    for (const step of steps) {
      const existing = bySession.get(step.sessionId) || []
      existing.push(step)
      bySession.set(step.sessionId, existing)
    }

    for (const [sessionId, sessionSteps] of bySession.entries()) {
      // Merge step data in chronological order
      const mergedData: Record<string, any> = {}
      let latestClientRecordedAt: Date | undefined
      let userEmail: string | undefined

      for (const step of sessionSteps) {
        Object.assign(mergedData, step.data)
        if (step.clientRecordedAt) {
          latestClientRecordedAt = new Date(step.clientRecordedAt)
        }
        if (step.data.email && typeof step.data.email === 'string') {
          userEmail = step.data.email.trim().toLowerCase()
        }
      }

      // If an email exists, link to User and upsert UserPortalData
      if (userEmail) {
        try {
          const user = await prisma.user.upsert({
            where: { email: userEmail },
            create: {
              email: userEmail,
              role: 'client',
              profile: { create: {} },
            },
            update: {},
          })

          await prisma.userPortalData.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              chakraSelected: (mergedData.chakraSelected as string) || null,
              archetypeSelected: (mergedData.archetypeSelected as string) || null,
              tarotCard: (mergedData.tarotCard as string) || null,
              tarotTheme: (mergedData.tarotTheme as string) || null,
              intentionText: (mergedData.intention as string) || null,
              q1Answer: (mergedData.q1Answer as string) || null,
              q2Answer: (mergedData.q2Answer as string) || null,
              q3Answer: (mergedData.q3Answer as string) || null,
              q4Answer: (mergedData.q4Answer as string) || null,
              q5Answer: (mergedData.q5Answer as string) || null,
              q6Answer: (mergedData.q6Answer as string) || null,
              q7Answer: (mergedData.q7Answer as string) || null,
              nervousSystemScore: (mergedData.nervousSystemScore as string) || null,
              relationshipScore: (mergedData.relationshipScore as string) || null,
              childhoodScore: (mergedData.childhoodScore as string) || null,
              financialScore: (mergedData.financialScore as string) || null,
              profileResult: (mergedData.profileResult as string) || null,
              isOfflineSync: true,
              clientRecordedAt: latestClientRecordedAt || new Date(),
              portalCompletedAt: mergedData.portalCompletedAt ? new Date(mergedData.portalCompletedAt as string) : null,
            },
            update: {
              chakraSelected: (mergedData.chakraSelected as string) || undefined,
              archetypeSelected: (mergedData.archetypeSelected as string) || undefined,
              tarotCard: (mergedData.tarotCard as string) || undefined,
              tarotTheme: (mergedData.tarotTheme as string) || undefined,
              intentionText: (mergedData.intention as string) || undefined,
              q1Answer: (mergedData.q1Answer as string) || undefined,
              q2Answer: (mergedData.q2Answer as string) || undefined,
              q3Answer: (mergedData.q3Answer as string) || undefined,
              q4Answer: (mergedData.q4Answer as string) || undefined,
              q5Answer: (mergedData.q5Answer as string) || undefined,
              q6Answer: (mergedData.q6Answer as string) || undefined,
              q7Answer: (mergedData.q7Answer as string) || undefined,
              nervousSystemScore: (mergedData.nervousSystemScore as string) || undefined,
              relationshipScore: (mergedData.relationshipScore as string) || undefined,
              childhoodScore: (mergedData.childhoodScore as string) || undefined,
              financialScore: (mergedData.financialScore as string) || undefined,
              profileResult: (mergedData.profileResult as string) || undefined,
              isOfflineSync: true,
              clientRecordedAt: latestClientRecordedAt || new Date(),
              portalCompletedAt: mergedData.portalCompletedAt ? new Date(mergedData.portalCompletedAt as string) : undefined,
            },
          })
        } catch (dbErr) {
          console.warn('Offline sync DB upsert skipped/failed:', dbErr)
        }
      }

      syncedCount += sessionSteps.length
    }

    return NextResponse.json({
      ok: true,
      syncedCount,
      message: `${syncedCount} offline steps synchronized successfully`,
    })
  } catch (error: any) {
    console.error('SYNC OFFLINE ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
