import { NextResponse } from 'next/server'
import { format } from 'date-fns'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') === '30d' ? 30 : 7

  const userId = session.user.id

  const since = new Date()
  since.setDate(since.getDate() - range)
  since.setHours(0, 0, 0, 0)

  const snapshots = await prisma.progressSnapshot.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: 'asc' },
    select: { date: true, score: true, sleepScore: true, activityScore: true, journalScore: true, wellbeingScore: true },
  })

  const history = snapshots.map(s => ({
    date: format(s.date, 'MMM d'),
    score: Math.round(s.score),
    sleep: Math.round(s.sleepScore),
    activity: Math.round(s.activityScore),
    journal: Math.round(s.journalScore),
    wellbeing: Math.round(s.wellbeingScore),
  }))

  const latest = snapshots.at(-1)
  const average = history.length
    ? Math.round(history.reduce((s, d) => s + d.score, 0) / history.length)
    : 0

  const streak = await prisma.profile.findUnique({
    where: { userId },
    select: { streakDays: true, progress: true },
  })

  const current = latest ? Math.round(latest.score) : Math.round(streak?.progress ?? 0)

  return NextResponse.json({
    success: true,
    current,
    average,
    history,
    trend: history,
    summary: { latest: current, average },
    breakdown: latest
      ? {
          sleep: Math.round(latest.sleepScore),
          activity: Math.round(latest.activityScore),
          journal: Math.round(latest.journalScore),
          wellbeing: Math.round(latest.wellbeingScore),
        }
      : { sleep: 0, activity: 0, journal: 0, wellbeing: 0 },
  })
}
