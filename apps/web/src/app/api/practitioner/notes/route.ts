import { NextRequest, NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'
import { canPublishAs } from '@/lib/content-publishing'
import { z } from 'zod'

const createSchema = z.object({
  userId: z.string().min(1),
  practitioner: z.string().optional(),
  keyThemes: z.array(z.string()).optional(),
  practicesAssigned: z.array(z.string()).optional(),
  nextSessionRecommendation: z.string().optional().nullable(),
  distressFlag: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const {
      userId,
      practitioner,
      keyThemes,
      practicesAssigned,
      nextSessionRecommendation,
      distressFlag,
    } = parsed.data

    const publishAs = practitioner || 'sejal'
    if (!canPublishAs(session, publishAs)) {
      return NextResponse.json(
        { error: `You are not authorized to publish session notes as "${publishAs}".` },
        { status: 403 }
      )
    }

    const sessionNote = await prisma.therapySession.create({
      data: {
        userId,
        practitioner: publishAs,
        sessionDate: new Date(),
        keyThemes: keyThemes || [],
        practicesAssigned: practicesAssigned || [],
        nextSessionRecommendation: nextSessionRecommendation || null,
        distressFlag: distressFlag || false,
        notesSubmittedAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, data: sessionNote })
  } catch (e) {
    console.error('PRACTITIONER NOTES ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
