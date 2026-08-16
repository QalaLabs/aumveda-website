import { NextResponse } from 'next/server'
import { getApiPractitionerSession } from '@/lib/session'

export async function GET() {
  const session = await getApiPractitionerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    console.error('PRACTITIONER SESSIONS ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
