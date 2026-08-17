import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        dob: true,
        placeOfBirth: true,
        sunSign: true,
        moonSign: true,
        risingSign: true,
        profile: {
          select: {
            timezone: true,
            avatarUrl: true,
            bio: true,
            progress: true,
            streakDays: true,
            onboardingDone: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [orderCount, bookingCount] = await Promise.all([
      prisma.order.count({ where: { userId: id } }),
      prisma.booking.count({ where: { userId: id } }),
    ])

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        counts: {
          orders: orderCount,
          bookings: bookingCount,
        },
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/users/[id]] GET error:', err)
    return NextResponse.json({ error: 'Failed to load user' }, { status: 500 })
  }
}
