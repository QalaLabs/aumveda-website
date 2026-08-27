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

  let items: any[] = []
  try {
    items = await prisma.clientHomework.findMany({
      where: { userId: session.user.id },
      orderBy: [{ status: 'asc' }, { assignedAt: 'desc' }],
    })
  } catch (e) {
    console.warn('Prisma homework query skipped/failed, serving demo homework:', e)
  }

  if (items.length === 0) {
    items = [
      {
        id: 'hw_1',
        title: 'Evening Body Scan & Nervous System Grounding',
        description:
          'Before sleep, lie down with one hand on your heart and one on your belly. Notice three places of tension and gently breathe warmth into them.',
        status: 'assigned',
        assignedAt: new Date(Date.now() - 86400000).toISOString(),
        dueAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        submissionText: null,
        submissionUrl: null,
        submittedAt: null,
        reviewNote: null,
        reviewedAt: null,
      },
      {
        id: 'hw_2',
        title: 'Morning Voice Note: 3 Moments of Safety',
        description: 'Record or write 3 moments this week where you felt genuinely safe, nourished, and calm.',
        status: 'submitted',
        assignedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        dueAt: new Date(Date.now() - 86400000).toISOString(),
        submissionText:
          'I noticed when I stood barefoot on the grass at sunrise, the morning chill on my toes and the quiet birdsong brought my heart rate right down.',
        submissionUrl: null,
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        reviewNote: null,
        reviewedAt: null,
      },
      {
        id: 'hw_3',
        title: 'Heart Chakra Anahata Mantra Meditation',
        description: 'Chant YAM facing East for 108 repetitions with rose oil on wrists.',
        status: 'reviewed',
        assignedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        dueAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        submissionText: 'Felt a deep emotional release around round 54. Felt much lighter afterward.',
        submissionUrl: null,
        submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        reviewNote:
          'Wonderful reflection, Aria. Tears and emotional release during round 54 are a classic sign of the heart granthi softening. Keep trusting the unfolding.',
        reviewedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ]
  }

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
