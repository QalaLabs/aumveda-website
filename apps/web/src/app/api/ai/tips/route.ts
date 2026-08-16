import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

const REFRAMES = [
  'Rest is not a reward you earn — it is the ground your effort grows from.',
  'You are not behind. You are exactly where a healing path with a few turns looks like.',
  'A nervous system that has been loud for years is not broken; it is still learning safety.',
  'Showing up gently, even when it feels small, is how the nervous system learns it can trust you.',
  'Progress is not a straight line. It is a spiral that returns you higher each time.',
  'The version of you that coped was resourceful. The version of you that heals is simply choosing softness now.',
  'Discipline that comes from self-trust lasts. Discipline that comes from self-criticism burns out.',
  'Your worth does not depend on your productivity. You are already enough in this breath.',
]

const PRACTICES = [
  { name: '4:8 Coherent Breath', body: 'Inhale for 4 counts, exhale for 8. Repeat 5 rounds to activate the vagus nerve.', seconds: 60 },
  { name: 'Body Scan Softness', body: 'Close your eyes and scan from crown to feet. Where you find tension, breathe into it for 2 breaths.', seconds: 120 },
  { name: 'Gratitude Pause', body: 'Name three small things that went well today. Write them down or whisper them.', seconds: 90 },
  { name: 'Nadi Shodhana', body: 'Alternate-nostril breathing: 6 rounds of 4-4-4 to balance the left and right hemispheres.', seconds: 120 },
  { name: 'Grounding Walk', body: 'Walk slowly for 5 minutes, noticing the soles of your feet with every step.', seconds: 300 },
]

const SEEDS = [
  'You are not here to be fixed. You are here to remember your wholeness.',
  'Healing asks for return, not perfection.',
  'The quieter you become, the more you hear your own wisdom.',
  'Safety is not a place. It is a frequency you learn to return to.',
]

const MOOD_REFRA_MAP: Record<number, string[]> = {
  1: ['A difficult day is data, not a verdict. Tend to yourself the way you would a friend.', 'Low days are not a failure of your practice — they are the reason the practice exists.'],
  2: ['Heavy is how the body says "slow down". Honouring it is the practice.', 'You do not need to feel better to be allowed to rest.'],
  3: ['Neutral days are the quiet work. Consistency here is what builds the foundation.', 'Not every day must feel profound to count.'],
  4: ['You are building momentum. Protect it with gentleness, not pressure.', 'Good days are proof your nervous system is learning to trust.'],
  5: ['Carry today\'s openness into tomorrow without clinging to it.', 'When you feel good, let it be simple. You do not need to prove it.'],
}

export async function POST() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  // Personalization signals — derived from real session data, never client input.
  const [recentJournals, achievements, doseCount] = await Promise.all([
    prisma.journal.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { mood: true },
    }),
    prisma.achievement.findMany({ where: { userId }, select: { key: true } }),
    prisma.dailyDoseCompletion.count({ where: { userId } }),
  ])

  const lastMood = recentJournals.find((j) => j.mood != null)?.mood ?? null
  const journalCount = await prisma.journal.count({ where: { userId, isDeleted: false } })
  const isActive = doseCount > 0 || journalCount > 0

  const seed = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const dayIndex = Math.floor(Date.now() / 86400_000)
  const pivot = (seed + dayIndex) % REFRAMES.length

  const reframes: string[] = []
  if (lastMood && MOOD_REFRA_MAP[lastMood]) {
    reframes.push(MOOD_REFRA_MAP[lastMood][dayIndex % MOOD_REFRA_MAP[lastMood].length])
  }
  for (let i = 0; reframes.length < 3; i++) {
    const candidate = REFRAMES[(pivot + i) % REFRAMES.length]
    if (!reframes.includes(candidate)) reframes.push(candidate)
  }

  const practice = PRACTICES[(seed + dayIndex) % PRACTICES.length]
  const seedLine = SEEDS[(seed + dayIndex) % SEEDS.length]

  const isPersonalized = isActive || achievements.length > 0

  // Audit trail event (append-only, matches the activity timeline contract).
  await prisma.event
    .create({
      data: {
        eventName: 'ai.tips.generated',
        userId,
        payload: { personalized: isPersonalized, mood: lastMood },
        source: 'server',
      },
    })
    .catch(() => null)

  return NextResponse.json({
    reframes,
    micro_practice: `${practice.name} — ${practice.body}`,
    seed: seedLine,
    isPersonalized,
  })
}
