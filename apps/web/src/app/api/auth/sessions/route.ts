import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

function parseUserAgent(ua: string | null): { os: string; browser: string } {
  let os = 'Unknown Device'
  let browser = 'Unknown Browser'
  if (!ua) return { os, browser }

  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('Linux')) os = 'Linux'

  if (ua.includes('Chrome') || ua.includes('CriOS')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'Internet Explorer'

  return { os, browser }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbSessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        sessionToken: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expires: true,
      },
    })

    const formatted = dbSessions.map((s) => {
      const { os, browser } = parseUserAgent(s.userAgent)
      return {
        id: s.id,
        os,
        browser,
        ipAddress: s.ipAddress || 'Unknown IP',
        createdAt: s.createdAt.toISOString(),
        expires: s.expires.toISOString(),
      }
    })

    return NextResponse.json({ ok: true, sessions: formatted })
  } catch (error: any) {
    console.error('GET SESSIONS ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const deleteSchema = z.object({
  sessionId: z.string().min(1),
})

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = deleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { sessionId } = parsed.data

    // Check if the session exists and belongs to the authenticated user
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    })

    if (!targetSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (targetSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Revoke session
    await prisma.session.delete({
      where: { id: sessionId },
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('DELETE SESSION ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
