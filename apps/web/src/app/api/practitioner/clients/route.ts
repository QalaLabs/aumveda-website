import { NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'

export async function GET() {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')
    const clients = await prisma.user.findMany({
      where: { portalData: { isNot: null } },
      select: {
        id: true,
        name: true,
        email: true,
        portalData: {
          select: { profileResult: true },
        },
        bookings: {
          select: { status: true },
          orderBy: { bookingDatetime: 'desc' },
          take: 1,
        },
        packages: {
          select: { sessionsTotal: true, sessionsUsed: true },
        },
        therapySessions: {
          select: { distressFlag: true, sessionDate: true },
          orderBy: { sessionDate: 'desc' },
          take: 1,
        },
        dailyDoseDeliveries: {
          select: { contentJson: true, date: true },
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    })

    const data = clients.map(c => {
      const pkg = c.packages[0]
      const lastSession = c.therapySessions[0]
      const lastDose = c.dailyDoseDeliveries[0]
      let doseTheme: string | null = null
      try {
        if (lastDose?.contentJson) doseTheme = JSON.parse(lastDose.contentJson)?.theme ?? null
      } catch { /* ignore */ }

      return {
        id: c.id,
        name: c.name || 'Unnamed',
        email: c.email,
        profileResult: c.portalData?.profileResult || '—',
        lastSessionDate: lastSession?.sessionDate?.toISOString() ?? null,
        sessionsRemaining: pkg ? pkg.sessionsTotal - pkg.sessionsUsed : 0,
        currentDoseTheme: doseTheme,
        distressFlag: lastSession?.distressFlag ?? false,
      }
    })

    return NextResponse.json({ ok: true, data })
  } catch (e) {
    console.error('PRACTITIONER CLIENTS ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
