import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@aumveda/db'
import { getApiSession } from '@/lib/session'

const schema = z.object({
  packageType: z.enum(['3_session', '6_session']),
})

// Records upgrade interest as an event so practitioners can follow up —
// deliberately does not touch payment/checkout (out of scope) or mint a
// Package row until payment is confirmed elsewhere.
export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  try {
    await prisma.event.create({
      data: {
        userId: session.user.id,
        eventName: 'package.upgrade.interest',
        payload: { packageType: parsed.data.packageType },
        source: 'server',
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PACKAGE UPGRADE INTEREST ERROR:', e)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
