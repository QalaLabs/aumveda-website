import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'

// All defined achievements (catalogue)
const ACHIEVEMENT_CATALOGUE = [
  {
    key: 'FIRST_JOURNAL',
    name: 'First Reflection',
    description: 'You wrote your very first journal entry.',
    icon: '📝',
    requirement: 'Write 1 journal entry',
  },
  {
    key: 'DAY_7',
    name: 'Day 7',
    description: 'Seven days of showing up for your check-in ritual.',
    icon: '🌿',
    requirement: 'Complete 7 check-in days in a row',
  },
  {
    key: 'DAY_21',
    name: 'Day 21',
    description: 'Three weeks of presence — the habit is taking root.',
    icon: '🌕',
    requirement: 'Complete 21 check-in days in a row',
  },
  {
    key: 'DAY_30',
    name: 'Day 30',
    description: 'A full lunar cycle of devotion to yourself.',
    icon: '✨',
    requirement: 'Complete 30 check-in days in a row',
  },
  {
    key: 'DAY_90',
    name: 'Day 90',
    description: 'A season of transformation. You have stayed.',
    icon: '🕉️',
    requirement: 'Complete 90 check-in days in a row',
  },
  {
    key: '7_DAY_STREAK',
    name: '7-Day Streak',
    description: 'You completed daily rituals for 7 consecutive days.',
    icon: '🔥',
    requirement: 'Complete 7 days in a row',
  },
  {
    key: 'PROGRESS_50',
    name: 'Halfway There',
    description: 'Your wellness score crossed 50 for the first time.',
    icon: '⭐',
    requirement: 'Reach a P score of 50',
  },
  {
    key: 'PROGRESS_75',
    name: 'High Achiever',
    description: 'Your wellness score crossed 75.',
    icon: '🏆',
    requirement: 'Reach a P score of 75',
  },
  {
    key: 'SLEEP_IMPROVED',
    name: 'Better Rest',
    description: 'Your sleep score improved by 10+ points over 7 days.',
    icon: '😴',
    requirement: 'Improve sleep score by 10 points',
  },
]

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const earned = await prisma.achievement.findMany({
    where: { userId: session.user.id },
    select: { key: true, earnedAt: true },
  })

  const earnedMap = new Map(earned.map(a => [a.key, a.earnedAt]))

  const achievements = ACHIEVEMENT_CATALOGUE.map(a => ({
    id: a.key,
    name: a.name,
    description: a.description,
    icon: a.icon,
    requirement: a.requirement,
    isEarned: earnedMap.has(a.key),
    earnedAt: earnedMap.get(a.key)?.toISOString() ?? null,
  }))

  return NextResponse.json({ success: true, achievements })
}
