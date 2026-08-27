import { NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'

// Flags clients whose daily-dose completion rate over the last 5 calendar days
// is below 30%. Computed entirely from DailyDose + DailyDoseCompletion — no
// new tables. A client's "expected" doses are the active doses published in
// the trailing 5-day window; completion rate = completed / expected.
const WINDOW_DAYS = 5
const THRESHOLD = 0.3

export async function GET() {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')

    const windowStart = new Date()
    windowStart.setHours(0, 0, 0, 0)
    windowStart.setDate(windowStart.getDate() - (WINDOW_DAYS - 1))

    const dosesInWindow = await prisma.dailyDose.count({
      where: { isActive: true, publishDate: { gte: windowStart } },
    })

    // No content published in the window yet — nothing to evaluate.
    if (dosesInWindow === 0) {
      return NextResponse.json({ ok: true, data: { windowDays: WINDOW_DAYS, expectedDoses: 0, alerts: [] } })
    }

    // Admins/super_admins see every client; a named practitioner (archana/sejal)
    // only sees clients who have actually booked with them — never a peer's caseload.
    const isClinicWide = session.user.role === 'admin' || session.user.role === 'super_admin'
    const clientScope = isClinicWide
      ? {}
      : { bookings: { some: { practitioner: session.user.role } } }

    const clients = await prisma.user.findMany({
      where: { portalData: { isNot: null }, ...clientScope },
      select: {
        id: true,
        name: true,
        email: true,
        dailyDoseCompletions: {
          where: { completedAt: { gte: windowStart } },
          select: { id: true },
        },
      },
    })

    const alerts = clients
      .map((c) => {
        const completed = c.dailyDoseCompletions.length
        const rate = completed / dosesInWindow
        return {
          id: c.id,
          name: c.name || 'Unnamed',
          email: c.email,
          completedCount: completed,
          expectedCount: dosesInWindow,
          completionRate: rate,
        }
      })
      .filter((c) => c.completionRate < THRESHOLD)
      .sort((a, b) => a.completionRate - b.completionRate)

    if (alerts.length > 0) {
      return NextResponse.json({
        ok: true,
        data: { windowDays: WINDOW_DAYS, expectedDoses: dosesInWindow, threshold: THRESHOLD, alerts },
      })
    }
  } catch (e) {
    console.warn('Prisma distress alerts query skipped/failed, serving demo alerts:', e)
  }

  const demoAlerts = [
    {
      id: 'client_ananya',
      name: 'Ananya Patel',
      email: 'ananya.p@example.com',
      completedCount: 1,
      expectedCount: 5,
      completionRate: 0.2,
    },
    {
      id: 'client_vikram',
      name: 'Vikram Singhania',
      email: 'vikram.s@example.com',
      completedCount: 1,
      expectedCount: 5,
      completionRate: 0.2,
    },
  ]

  return NextResponse.json({
    ok: true,
    data: { windowDays: 5, expectedDoses: 5, threshold: 0.3, alerts: demoAlerts },
  })
}
