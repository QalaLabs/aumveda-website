import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@aumveda/db')
    const overrides = await prisma.dailyDoseOverride.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ ok: true, data: overrides })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const { userId, practiceType, instructionText, durationDays } = body

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
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
