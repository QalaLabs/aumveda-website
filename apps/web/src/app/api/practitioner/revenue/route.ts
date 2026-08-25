import { NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'

// Read-only aggregate revenue view for practitioners/admins.
// Sources only existing tables (Booking, Package, Subscription) — no new schema.
export async function GET() {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@aumveda/db')

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // Admins/super_admins see clinic-wide revenue; a named practitioner (archana/sejal)
    // only sees their own bookings — never a peer's.
    const isClinicWide = session.user.role === 'admin' || session.user.role === 'super_admin'
    const practitionerFilter = isClinicWide ? {} : { practitioner: session.user.role }

    const [
      sessionsBookedThisMonth,
      bookingsThisMonth,
      packagesThisMonth,
      activeSubscriptions,
      bookingsByPractitioner,
    ] = await Promise.all([
      prisma.booking.count({
        where: { createdAt: { gte: monthStart, lt: nextMonthStart }, ...practitionerFilter },
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: monthStart, lt: nextMonthStart },
          status: { not: 'cancelled' },
          ...practitionerFilter,
        },
        _sum: { amountPaid: true },
      }),
      prisma.package.aggregate({
        where: { purchasedAt: { gte: monthStart, lt: nextMonthStart } },
        _sum: { amountPaid: true },
        _count: { id: true },
      }),
      prisma.subscription.aggregate({
        where: { status: 'active' },
        _sum: { amount: true },
        _count: { id: true },
      }),
      isClinicWide
        ? prisma.booking.groupBy({
            by: ['practitioner'],
            where: { createdAt: { gte: monthStart, lt: nextMonthStart } },
            _count: { id: true },
          })
        : Promise.resolve([]),
    ])

    const bookingRevenue = Number(bookingsThisMonth._sum.amountPaid ?? 0)
    const packageRevenue = Number(packagesThisMonth._sum.amountPaid ?? 0)
    const communityMrr = Number(activeSubscriptions._sum.amount ?? 0)

    return NextResponse.json({
      ok: true,
      data: {
        month: monthStart.toISOString(),
        sessionsBookedThisMonth,
        bookingRevenue,
        packageRevenue,
        packagesSoldThisMonth: packagesThisMonth._count.id,
        communityMrr,
        activeSubscriptions: activeSubscriptions._count.id,
        totalRevenueThisMonth: bookingRevenue + packageRevenue,
        bookingsByPractitioner: bookingsByPractitioner.map((row) => ({
          practitioner: row.practitioner,
          sessionsBooked: row._count.id,
        })),
      },
    })
  } catch (e) {
    console.error('PRACTITIONER REVENUE ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
