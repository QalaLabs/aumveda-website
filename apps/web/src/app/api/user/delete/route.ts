import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

const schema = z.object({
  password: z.string().optional(),
  confirm: z.string().optional(),
})

const CONFIRM_PHRASE = 'confirm-delete'

export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body ?? {})
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const { password, confirm } = parsed.data
  const confirmed =
    password === CONFIRM_PHRASE || confirm === CONFIRM_PHRASE

  if (!confirmed) {
    return NextResponse.json(
      { error: 'Confirmation phrase required to delete your account' },
      { status: 400 },
    )
  }

  await prisma.user.delete({ where: { id: session.user.id } })

  return NextResponse.json({
    success: true,
    message:
      'Your account and all associated data have been permanently deleted. Thank you for your time with Aumveda.',
  })
}
