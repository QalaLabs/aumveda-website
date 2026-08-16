import { NextResponse } from 'next/server'
import { format } from 'date-fns'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

const STEPS_TARGET = 10000
const SLEEP_TARGET_HRS = 8
const WORKOUT_TARGET_MIN = 150

export async function GET() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  const since = new Date()
  since.setDate(since.getDate() - 7)
  since.setHours(0, 0, 0, 0)

  const [rows, journalCount, healthConsent] = await Promise.all([
    prisma.healthMetric.findMany({
      where: { userId, metricDate: { gte: since } },
      orderBy: { metricDate: 'asc' },
    }),
    prisma.journal.count({
      where: { userId, createdAt: { gte: since }, isDeleted: false },
    }),
    prisma.consent.findUnique({
      where: { userId_key: { userId, key: 'health_sync' } },
    }),
  ])

  const sleepHours = rows
    .map((r) => (r.sleepMinutes != null ? r.sleepMinutes / 60 : null))
    .filter((v): v is number => v != null)

  const avgSleep = sleepHours.length
    ? Math.round((sleepHours.reduce((a, b) => a + b, 0) / sleepHours.length) * 10) / 10
    : 0

  const sleepScore = rows.length
    ? Math.round(rows.reduce((sum, r) => sum + (r.sleepScore ?? 0), 0) / rows.length)
    : 0

  const history = rows.slice(-7).map((r) => ({
    day: format(r.metricDate, 'EEE'),
    value: Math.round((r.sleepMinutes ?? 0) / 60 * 10) / 10,
  }))

  const latestSteps =
    [...rows].reverse().find((r) => r.steps != null)?.steps ?? 0
  const stepsPct = Math.min(100, Math.round((latestSteps / STEPS_TARGET) * 100))

  const weeklyTotal = rows.reduce((sum, r) => sum + (r.workoutMinutes ?? 0), 0)
  const workoutSessions = rows.filter((r) => (r.workoutMinutes ?? 0) > 0).length

  const journalScore = Math.min(100, journalCount * 20)

  return NextResponse.json({
    success: true,
    metrics: {
      sleep: {
        value: avgSleep,
        current: avgSleep,
        target: SLEEP_TARGET_HRS,
        score: sleepScore,
        unit: 'hrs',
        history,
      },
      steps: {
        value: latestSteps,
        current: latestSteps,
        target: STEPS_TARGET,
        percentage: stepsPct,
        score: stepsPct,
        unit: 'steps',
      },
      workouts: {
        weeklyTotal,
        target: WORKOUT_TARGET_MIN,
        sessions: workoutSessions,
        unit: 'mins',
      },
      activity: {
        value: latestSteps,
        score: stepsPct,
        unit: 'steps',
      },
      journal: {
        value: journalCount,
        score: journalScore,
        unit: 'entries',
      },
    },
    lastSync: rows.length ? rows[rows.length - 1].updatedAt.toISOString() : null,
    isConsented: healthConsent?.value ?? false,
  })
}
