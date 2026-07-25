import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

async function recalculateProgress(userId: string) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const journalCount = await prisma.journal.count({
    where: { userId, isDeleted: false, createdAt: { gte: sevenDaysAgo } },
  })
  const J_t = (Math.min(journalCount, 7) / 7) * 100

  const journals = await prisma.journal.findMany({
    where: { userId, isDeleted: false, mood: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 7,
    select: { mood: true },
  })
  const avgMood = journals.length
    ? journals.reduce((s, j) => s + (j.mood ?? 3), 0) / journals.length
    : 3
  const W_t = avgMood * 20

  const S_t = 50
  const A_t = 0
  const P_t = 0.35 * S_t + 0.30 * A_t + 0.25 * J_t + 0.10 * W_t

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.progressSnapshot.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, score: P_t, sleepScore: S_t, activityScore: A_t, journalScore: J_t, wellbeingScore: W_t },
    update: { score: P_t, journalScore: J_t, wellbeingScore: W_t },
  })

  await prisma.profile.update({ where: { userId }, data: { progress: P_t } })
}

const createSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(5).nullable().optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  voiceNoteUrl: z.string().nullable().optional(),
  aiReflection: z.string().nullable().optional(),
  practitionerVisible: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')

  const journals = await prisma.journal.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
          { tags: { has: search.toLowerCase().replace(/\s+/g, '-') } }
        ]
      })
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, mood: true, createdAt: true, body: true, tags: true },
  })

  return NextResponse.json({ ok: true, data: journals })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const journal = await prisma.journal.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title ?? null,
      body: parsed.data.body,
      mood: parsed.data.mood ?? null,
      tags: parsed.data.tags ?? [],
      voiceNoteUrl: parsed.data.voiceNoteUrl ?? null,
      aiReflection: parsed.data.aiReflection ?? null,
      practitionerVisible: parsed.data.practitionerVisible ?? true,
    },
    select: { id: true, title: true, createdAt: true },
  })

  const uid = session.user.id

  // Fire event + achievement check in background
  Promise.all([
    prisma.event.create({
      data: {
        userId: uid,
        eventName: 'journal.created',
        payload: { journalId: journal.id },
        source: 'server',
      },
    }),
    // FIRST_JOURNAL achievement
    prisma.achievement.upsert({
      where: { userId_key: { userId: uid, key: 'FIRST_JOURNAL' } },
      create: { userId: uid, key: 'FIRST_JOURNAL' },
      update: {},
    }),
    // Recalculate progress
    recalculateProgress(uid),
  ]).catch(() => null)

  return NextResponse.json({ ok: true, data: journal }, { status: 201 })
}
