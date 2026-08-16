import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.consent.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, key: true, value: true, version: true, updatedAt: true },
  })

  const consents = rows.map((r) => ({
    key: r.key,
    value: r.value,
    version: r.version,
    updatedAt: r.updatedAt.toISOString(),
  }))

  const history = rows.map((r) => ({
    id: String(r.id),
    key: r.key,
    value: r.value,
    action: r.value ? 'OPT_IN' : 'OPT_OUT',
    timestamp: r.updatedAt.toISOString(),
    version: parseInt(r.version.replace(/[^0-9]/g, '') || '1', 10),
  }))

  return NextResponse.json({ success: true, consents, history })
}

const postSchema = z.object({
  key: z.string().min(1).max(64),
  value: z.boolean(),
  version: z.string().default('v1'),
})

export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = postSchema.safeParse(body ?? {})
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const { key, value, version } = parsed.data
  const consent = await prisma.consent.upsert({
    where: { userId_key: { userId: session.user.id, key } },
    create: { userId: session.user.id, key, value, version },
    update: { value, version },
  })

  return NextResponse.json({ success: true, data: consent })
}
