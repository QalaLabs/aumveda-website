import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const submitSchema = z.object({
  id: z.string().min(1),
  submissionText: z.string().max(5000).optional().nullable(),
  submissionUrl: z
    .union([z.string().url().max(2000), z.literal(''), z.null()])
    .optional(),
})

/** GET /api/dashboard/homework — list assigned / submitted / reviewed */
export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const items = await prisma.clientHomework.findMany({
    where: { userId: session.user.id },
    orderBy: [{ status: 'asc' }, { assignedAt: 'desc' }],
  })

  const grouped = {
    assigned: items.filter((h) => h.status === 'assigned'),
    submitted: items.filter((h) => h.status === 'submitted'),
    reviewed: items.filter((h) => h.status === 'reviewed'),
  }

  return NextResponse.json({ success: true, items, grouped })
}

/** POST /api/dashboard/homework — submit text/url for an assignment */
export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { id, submissionText, submissionUrl } = parsed.data
  const text = submissionText?.trim() || null
  const url = typeof submissionUrl === 'string' ? submissionUrl.trim() || null : null

  if (!text && !url) {
    return NextResponse.json(
      { error: 'Add a reflection or a link before submitting.' },
      { status: 400 }
    )
  }

  const existing = await prisma.clientHomework.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Homework not found' }, { status: 404 })
  }
  if (existing.status === 'reviewed') {
    return NextResponse.json(
      { error: 'This homework has already been reviewed.' },
      { status: 400 }
    )
  }

  const updated = await prisma.clientHomework.update({
    where: { id },
    data: {
      submissionText: text,
      submissionUrl: url,
      submittedAt: new Date(),
      status: 'submitted',
    },
  })

  return NextResponse.json({ success: true, homework: updated })
}
