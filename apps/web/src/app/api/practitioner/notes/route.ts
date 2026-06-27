import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import('@aumveda/db')
    const body = await req.json()
    const {
      userId, practitioner, serviceType, keyThemes,
      practicesAssigned, nextSessionRecommendation, distressFlag,
    } = body

    const session = await prisma.therapySession.create({
      data: {
        userId,
        practitioner: practitioner || 'sejal',
        sessionDate: new Date(),
        keyThemes: keyThemes || [],
        practicesAssigned: practicesAssigned || [],
        nextSessionRecommendation: nextSessionRecommendation || null,
        distressFlag: distressFlag || false,
        notesSubmittedAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, data: session })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
