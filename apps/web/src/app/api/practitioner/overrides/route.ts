import { NextRequest, NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'
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
    return NextResponse.json({ ok: true, data: overrides })
  } catch (e) {
    console.error('PRACTITIONER OVERRIDES GET ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
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
