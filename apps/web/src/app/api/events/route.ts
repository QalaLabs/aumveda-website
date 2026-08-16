import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { Prisma, prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

const ICONS: Record<string, string> = {
  'journal.created': 'BookOpen',
  'journal.completed': 'BookOpen',
  'daily_dose.completed': 'Heart',
  'purchase.completed': 'ShoppingBag',
  'health_sync.completed': 'Activity',
  'ai.tips.generated': 'Sparkles',
  'achievement.unlocked': 'Trophy',
  'portal.completed': 'Compass',
  'portal.step_completed': 'Compass',
  sign_up: 'UserPlus',
}

const MILESTONES = new Set([
  'achievement.unlocked',
  'purchase.completed',
  'portal.completed',
  'sign_up',
])

function describe(name: string, payload: Record<string, unknown> | null): string {
  switch (name) {
    case 'journal.created':
      return 'You wrote a new journal reflection.'
    case 'journal.completed':
      return 'You completed a journal entry with an AI reflection.'
    case 'daily_dose.completed':
      return 'You completed today\'s Daily Dose ritual.'
    case 'purchase.completed':
      return payload?.orderId
        ? `Purchase completed (order ${String(payload.orderId)}).`
        : 'Purchase completed.'
    case 'health_sync.completed':
      return 'Your health metrics were synced.'
    case 'ai.tips.generated':
      return 'Your personalized AI wellness insights were generated.'
    case 'achievement.unlocked':
      return payload?.achievementName
        ? `Achievement unlocked: ${String(payload.achievementName)}.`
        : 'Achievement unlocked.'
    case 'portal.completed':
      return 'You completed your Aumveda intake portal.'
    case 'portal.step_completed':
      return 'You progressed through your intake portal.'
    case 'sign_up':
      return 'Welcome to Aumveda.'
    default:
      return 'A journey milestone was recorded.'
  }
}

function humanize(name: string): string {
  return name
    .split('.')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function GET(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const limit = Math.min(
    Math.max(parseInt(searchParams.get('limit') || '15', 10) || 15, 1),
    100,
  )
  const type = searchParams.get('type') || ''
  const cursorParam = searchParams.get('cursor')

  let cursorId: number | null = null
  if (cursorParam) {
    cursorId = parseInt(cursorParam, 10)
    if (isNaN(cursorId) || cursorId < 0) {
      return NextResponse.json({ success: false, error: 'Invalid cursor' }, { status: 400 })
    }
  }

  const where: Prisma.EventWhereInput = { userId: session.user.id }
  if (type) where.eventName = type
  if (cursorId) where.id = { lt: cursorId }

  const rows = await prisma.event.findMany({
    where,
    orderBy: { id: 'desc' },
    take: limit + 1,
    select: { id: true, eventName: true, payload: true, createdAt: true },
  })

  const hasMore = rows.length > limit
  const page = rows.slice(0, limit)

  const events = page.map((e) => ({
    id: String(e.id),
    name: e.eventName,
    title: humanize(e.eventName),
    description: describe(e.eventName, e.payload as Record<string, unknown> | null),
    timestamp: e.createdAt.toISOString(),
    icon: ICONS[e.eventName] ?? 'Circle',
    isMilestone: MILESTONES.has(e.eventName),
    insight: null,
    payload: e.payload ?? {},
  }))

  return NextResponse.json({
    success: true,
    events,
    nextCursor: hasMore ? String(page[page.length - 1].id) : null,
  })
}
