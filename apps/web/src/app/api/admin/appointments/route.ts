import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  practitioner: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      search: searchParams.get('search') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      practitioner: searchParams.get('practitioner') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    const where: Record<string, unknown> = {}

    if (query.status) {
      where.status = query.status
    }

    if (query.practitioner) {
      where.practitioner = { contains: query.practitioner, mode: 'insensitive' }
    }

    if (query.search) {
      where.OR = [
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
        { user: { email: { contains: query.search, mode: 'insensitive' } } },
        { practitioner: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const skip = (query.page - 1) * query.limit

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.booking.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      bookings: bookings.map((b) => ({
        id: b.id,
        practitioner: b.practitioner,
        serviceType: b.serviceType,
        bookingDatetime: b.bookingDatetime,
        durationMinutes: b.durationMinutes,
        status: b.status,
        amountPaid: Number(b.amountPaid),
        createdAt: b.createdAt,
        user: b.user,
      })),
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch (err: unknown) {
    console.error('[api/admin/appointments] GET error:', err)
    return NextResponse.json({ error: 'Failed to load appointments' }, { status: 500 })
  }
}
