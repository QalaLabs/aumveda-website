import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

function todayDate(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const checkInSchema = z.object({
  consciousThoughts: z.string().max(2000).optional().nullable(),
  gratitude: z.string().max(2000).optional().nullable(),
  affirmationsDone: z.boolean().optional(),
  routinesDone: z.boolean().optional(),
  habitNote: z.string().max(1000).optional().nullable(),
  beliefNote: z.string().max(1000).optional().nullable(),
  journalNote: z.string().max(2000).optional().nullable(),
  emotions: z.array(z.string().max(40)).max(12).optional(),
  oneChange: z.string().max(1000).optional().nullable(),
  appreciation: z.string().max(1000).optional().nullable(),
  complete: z.boolean().optional(),
})

const STREAK_BADGES = [
  { days: 7, key: 'DAY_7' },
  { days: 21, key: 'DAY_21' },
  { days: 30, key: 'DAY_30' },
  { days: 90, key: 'DAY_90' },
] as const

async function updateStreakAndBadges(userId: string) {
  const checkIns = await prisma.dailyCheckIn.findMany({
    where: { userId, completedAt: { not: null } },
    orderBy: { date: 'desc' },
    select: { date: true },
    take: 120,
  })

  let streak = 0
  const cursor = todayDate()
  for (const row of checkIns) {
    const d = new Date(row.date)
    d.setHours(0, 0, 0, 0)
    if (d.getTime() === cursor.getTime()) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else if (d.getTime() < cursor.getTime()) {
      break
    }
  }

  await prisma.profile.upsert({
    where: { userId },
    create: { userId, streakDays: streak, timezone: 'Asia/Kolkata' },
    update: { streakDays: streak },
  })

  for (const badge of STREAK_BADGES) {
    if (streak >= badge.days) {
      await prisma.achievement.upsert({
        where: { userId_key: { userId, key: badge.key } },
        create: { userId, key: badge.key, metadata: { streakDays: streak } },
        update: {},
      })
    }
  }

  if (streak >= 7) {
    await prisma.achievement.upsert({
      where: { userId_key: { userId, key: '7_DAY_STREAK' } },
      create: { userId, key: '7_DAY_STREAK' },
      update: {},
    })
  }

  return streak
}

/** GET /api/dashboard/check-in — today's check-in + streak */
export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const date = todayDate()

  const [checkIn, profile, completedCount] = await Promise.all([
    prisma.dailyCheckIn.findUnique({
      where: { userId_date: { userId, date } },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: { streakDays: true, progress: true },
    }),
    prisma.dailyCheckIn.count({
      where: { userId, completedAt: { not: null } },
    }),
  ])

  return NextResponse.json({
    success: true,
    checkIn,
    streakDays: profile?.streakDays ?? 0,
    progress: profile?.progress ?? 0,
    completedCount,
  })
}

/** POST /api/dashboard/check-in — upsert today's ritual */
export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json().catch(() => null)
  const parsed = checkInSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const date = todayDate()
  const markComplete = data.complete === true

  const checkIn = await prisma.dailyCheckIn.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      consciousThoughts: data.consciousThoughts ?? null,
      gratitude: data.gratitude ?? null,
      affirmationsDone: data.affirmationsDone ?? false,
      routinesDone: data.routinesDone ?? false,
      habitNote: data.habitNote ?? null,
      beliefNote: data.beliefNote ?? null,
      journalNote: data.journalNote ?? null,
      emotions: data.emotions ?? [],
      oneChange: data.oneChange ?? null,
      appreciation: data.appreciation ?? null,
      completedAt: markComplete ? new Date() : null,
    },
    update: {
      ...(data.consciousThoughts !== undefined && {
        consciousThoughts: data.consciousThoughts,
      }),
      ...(data.gratitude !== undefined && { gratitude: data.gratitude }),
      ...(data.affirmationsDone !== undefined && {
        affirmationsDone: data.affirmationsDone,
      }),
      ...(data.routinesDone !== undefined && { routinesDone: data.routinesDone }),
      ...(data.habitNote !== undefined && { habitNote: data.habitNote }),
      ...(data.beliefNote !== undefined && { beliefNote: data.beliefNote }),
      ...(data.journalNote !== undefined && { journalNote: data.journalNote }),
      ...(data.emotions !== undefined && { emotions: data.emotions }),
      ...(data.oneChange !== undefined && { oneChange: data.oneChange }),
      ...(data.appreciation !== undefined && { appreciation: data.appreciation }),
      ...(markComplete && { completedAt: new Date() }),
    },
  })

  let streakDays = 0
  if (markComplete || checkIn.completedAt) {
    streakDays = await updateStreakAndBadges(userId)
  } else {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { streakDays: true },
    })
    streakDays = profile?.streakDays ?? 0
  }

  return NextResponse.json({ success: true, checkIn, streakDays })
}
