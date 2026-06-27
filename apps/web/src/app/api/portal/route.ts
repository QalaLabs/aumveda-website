import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, step, data } = body

    if (!userId || !step) {
      return NextResponse.json({ ok: false, error: 'userId and step required' }, { status: 400 })
    }

    const allowedFields: Record<number, string[]> = {
      2: ['chakraSelected'],
      3: ['archetypeSelected'],
      4: ['tarotCard', 'tarotTheme'],
      5: ['intentionText'],
      6: ['dob', 'timeOfBirth', 'placeOfBirth', 'birthLat', 'birthLng', 'email'],
      7: ['q1Answer', 'q2Answer', 'q3Answer', 'q4Answer', 'q5Answer', 'q6Answer', 'q7Answer',
           'nervousSystemScore', 'relationshipScore', 'childhoodScore', 'financialScore', 'profileResult'],
      8: ['portalCompletedAt'],
    }

    const allowed = allowedFields[step] || []
    const updateData: any = {}
    for (const field of allowed) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }
    // Handle step 6 user data
    if (step === 6) {
      if (data.email) {
        await prisma.user.upsert({
          where: { id: userId },
          update: {
            email: data.email,
            name: data.name || undefined,
            dob: data.dob ? new Date(data.dob) : undefined,
            placeOfBirth: data.placeOfBirth || undefined,
            birthLat: data.birthLat || undefined,
            birthLng: data.birthLng || undefined,
          },
          create: {
            id: userId,
            email: data.email,
            name: data.name || '',
            dob: data.dob ? new Date(data.dob) : new Date(),
            placeOfBirth: data.placeOfBirth || '',
            birthLat: data.birthLat || 0,
            birthLng: data.birthLng || 0,
          },
        })
      }
    }

    // Upsert portal data
    const portalData = await prisma.userPortalData.upsert({
      where: { userId },
      update: updateData,
      create: { userId, ...updateData },
    })

    // Log portal event
    await prisma.event.create({
      data: {
        eventName: step === 8 ? 'portal.completed' : 'portal.step_completed',
        userId,
        payload: { step, ...updateData },
        source: 'server',
      },
    })

    return NextResponse.json({ ok: true, data: portalData })
  } catch (error) {
    console.error('Portal save error:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ ok: false, error: 'userId required' }, { status: 400 })
  }

  const data = await prisma.userPortalData.findUnique({ where: { userId } })
  return NextResponse.json({ ok: true, data })
}
