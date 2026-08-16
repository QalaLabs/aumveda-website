import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const [
    user,
    journals,
    orders,
    consents,
    achievements,
    progressSnapshots,
    portalData,
    bookings,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        dob: true,
        sunSign: true,
        moonSign: true,
        risingSign: true,
        createdAt: true,
        profile: { select: { timezone: true, bio: true, progress: true, streakDays: true, onboardingDone: true } },
      },
    }),
    prisma.journal.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, body: true, mood: true, tags: true, aiReflection: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, status: true, totalCents: true, currency: true, createdAt: true },
    }),
    prisma.consent.findMany({
      where: { userId },
      select: { key: true, value: true, version: true, updatedAt: true },
    }),
    prisma.achievement.findMany({
      where: { userId },
      select: { key: true, earnedAt: true },
    }),
    prisma.progressSnapshot.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { date: true, score: true, sleepScore: true, activityScore: true, journalScore: true, wellbeingScore: true },
    }),
    prisma.userPortalData.findUnique({ where: { userId } }),
    prisma.booking.findMany({
      where: { userId },
      orderBy: { bookingDatetime: 'desc' },
      select: { id: true, serviceType: true, bookingDatetime: true, status: true, practitioner: true },
    }),
  ])

  const data = {
    exportedAt: new Date().toISOString(),
    user,
    journals,
    orders,
    consents,
    achievements,
    progressSnapshots,
    portalData,
    bookings,
  }

  await prisma.event
    .create({
      data: {
        eventName: 'user.export_requested',
        userId,
        payload: { scope: 'full' },
        source: 'server',
      },
    })
    .catch(() => null)

  return NextResponse.json({
    success: true,
    message: 'Your data export is ready.',
    data,
  })
}
