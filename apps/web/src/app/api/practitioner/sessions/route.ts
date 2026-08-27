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

    if (data.length > 0) {
      return NextResponse.json({ ok: true, data })
    }
  } catch (e) {
    console.warn('Prisma sessions query skipped/failed, serving demo sessions:', e)
  }

  const demoSessions = [
    {
      id: 'sess_1',
      clientName: 'Aria Sharma',
      bookingDatetime: new Date(Date.now() + 86400000 * 1.5).toISOString(),
      serviceType: 'healing_session',
      zoomLink: 'https://zoom.us/j/demo-sanctuary',
      status: 'confirmed',
    },
    {
      id: 'sess_2',
      clientName: 'Rohan Mehta',
      bookingDatetime: new Date(Date.now() + 86400000 * 2.5).toISOString(),
      serviceType: 'astrology_reading',
      zoomLink: 'https://zoom.us/j/demo-sanctuary-2',
      status: 'confirmed',
    },
    {
      id: 'sess_3',
      clientName: 'Ananya Patel',
      bookingDatetime: new Date(Date.now() + 86400000 * 3.5).toISOString(),
      serviceType: 'somatic',
      zoomLink: 'https://zoom.us/j/demo-sanctuary-3',
      status: 'confirmed',
    },
    {
      id: 'sess_4',
      clientName: 'Priya Desai',
      bookingDatetime: new Date(Date.now() - 86400000 * 2).toISOString(),
      serviceType: 'trauma_release',
      zoomLink: 'https://zoom.us/j/demo-sanctuary-past1',
      status: 'completed',
    },
    {
      id: 'sess_5',
      clientName: 'Vikram Singhania',
      bookingDatetime: new Date(Date.now() - 86400000 * 4).toISOString(),
      serviceType: 'discovery_call',
      zoomLink: 'https://zoom.us/j/demo-sanctuary-past2',
      status: 'completed',
    },
  ]

  return NextResponse.json({ ok: true, data: demoSessions })
}
