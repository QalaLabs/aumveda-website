import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [
      productStats,
      orderStats,
      paymentStats,
      revenueResult,
      userCount,
      leadCount,
      bookingStats,
    ] = await Promise.all([
      prisma.product.aggregate({
        _count: { id: true },
        where: { isActive: true },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.order.groupBy({
        by: ['paymentStatus'],
        _count: { id: true },
      }),
      prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.user.count(),
      prisma.event.count({ where: { eventName: 'lead_magnet' } }),
      prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ])

    const totalProducts = await prisma.product.count()
    const activeProducts = productStats._count.id
    const lowStock = await prisma.product.count({
      where: { inventoryCount: { gt: 0, lte: 5 } },
    })
    const outOfStock = await prisma.product.count({
      where: { inventoryCount: 0 },
    })

    const orderCountMap: Record<string, number> = {}
    for (const row of orderStats) {
      orderCountMap[row.status] = row._count.id
    }

    const paymentCountMap: Record<string, number> = {}
    for (const row of paymentStats) {
      paymentCountMap[row.paymentStatus] = row._count.id
    }

    const bookingCountMap: Record<string, number> = {}
    for (const row of bookingStats) {
      bookingCountMap[row.status] = row._count.id
    }

    return NextResponse.json({
      success: true,
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock,
        outOfStock,
      },
      orders: {
        total: orderStats.reduce((sum, r) => sum + r._count.id, 0),
        pending: orderCountMap['PENDING'] ?? 0,
        paid: paymentCountMap['PAID'] ?? 0,
        failed: paymentCountMap['FAILED'] ?? 0,
        refunded: paymentCountMap['REFUNDED'] ?? 0,
      },
      revenue: (revenueResult._sum.totalCents ?? 0) / 100,
      users: {
        total: userCount,
      },
      leads: {
        total: leadCount,
      },
      appointments: {
        total: bookingStats.reduce((sum, r) => sum + r._count.id, 0),
        pending: bookingCountMap['pending'] ?? 0,
      },
    })
  } catch (err: unknown) {
    console.error('[api/admin/dashboard] GET error:', err)
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 })
  }
}
