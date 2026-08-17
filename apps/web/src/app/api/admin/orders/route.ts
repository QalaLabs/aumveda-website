import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
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
      paymentStatus: searchParams.get('paymentStatus') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    const where: Record<string, unknown> = {}

    if (query.status) {
      where.status = query.status
    }

    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus
    }

    if (query.search) {
      const searchInt = parseInt(query.search, 10)
      const orConditions: Record<string, unknown>[] = [
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
      ]
      if (!isNaN(searchInt)) {
        orConditions.push({ id: searchInt })
      }
      where.OR = orConditions
    }

    const skip = (query.page - 1) * query.limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: { select: { images: true, title: true } } },
          },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        userId: o.userId,
        status: o.status,
        paymentStatus: o.paymentStatus,
        totalInr: o.totalCents / 100,
        currency: o.currency,
        customerEmail: o.customerEmail,
        customerName: o.customerName,
        eazebusOrderId: o.eazebusOrderId,
        eazebusPaymentId: o.eazebusPaymentId,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        items: o.items,
        user: o.user,
      })),
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch (err: unknown) {
    console.error('[api/admin/orders] GET error:', err)
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 })
  }
}
