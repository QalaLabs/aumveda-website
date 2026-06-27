import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@aumveda/db')
    const sessions = await prisma.booking.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { bookingDatetime: 'desc' },
      take: 50,
    })

    const data = sessions.map(s => ({
      id: s.id,
      clientName: s.user.name || 'Unnamed',
      bookingDatetime: s.bookingDatetime.toISOString(),
      serviceType: s.serviceType,
      zoomLink: s.zoomLink,
      status: s.status,
    }))

    return NextResponse.json({ ok: true, data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
