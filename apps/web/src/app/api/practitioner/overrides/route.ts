import { NextRequest, NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'
import { canPublishContent } from '@/lib/content-publishing'
import { z } from 'zod'

export async function GET() {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')
    const overrides = await prisma.dailyDoseOverride.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    if (overrides.length > 0) {
      return NextResponse.json({ ok: true, data: overrides })
    }
  } catch (e) {
    console.warn('Prisma overrides query skipped/failed, serving demo overrides:', e)
  }

  const demoOverrides = [
    {
      id: 'ov_1',
      userId: 'client_aria',
      practiceType: 'Heart Opening Breathwork & Vagus Nerve Soothing',
      instructionText: 'Practice 4-4-6 pranayama upon waking. Focus attention on the anahata chakra with rose oil.',
      startsAt: new Date(Date.now() - 86400000).toISOString(),
      durationDays: 7,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ov_2',
      userId: 'client_rohan',
      practiceType: 'Box Breathing with Cold Water Splash',
      instructionText: '4 seconds in, 4 hold, 4 out, 4 hold. Follow with splash of cold water to ground acute anxiety.',
      startsAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      durationDays: 14,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ov_3',
      userId: 'client_ananya',
      practiceType: 'Chant HAM (Throat Chakra Vibration)',
      instructionText: 'Humming bee breath (Bhramari) 5 minutes morning and evening to stimulate thyroid and clear blocked voice.',
      startsAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      durationDays: 10,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ]

  return NextResponse.json({ ok: true, data: demoOverrides })
}

const createSchema = z.object({
  userId: z.string().min(1),
  practiceType: z.string().min(1),
  instructionText: z.string().min(1),
  durationDays: z.number().int().positive().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!canPublishContent(session)) {
    return NextResponse.json(
      { error: 'You are not authorized to publish daily-dose content.' },
      { status: 403 }
    )
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

    const { userId, practiceType, instructionText, durationDays } = parsed.data

    const override = await prisma.dailyDoseOverride.create({
      data: {
        userId,
        practiceType,
        instructionText,
        startsAt: new Date(),
        durationDays: durationDays || 7,
      },
    })
    return NextResponse.json({ ok: true, data: override })
  } catch (e) {
    console.error('PRACTITIONER OVERRIDES POST ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
