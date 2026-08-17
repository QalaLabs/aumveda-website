import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          timezone: true,
          avatarUrl: true,
          bio: true,
          progress: true,
          streakDays: true,
          onboardingDone: true,
        },
      },
    },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true, data: user })
}

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  bio: z.string().max(500).optional(),
  onboardingDone: z.boolean().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { name, timezone, bio, onboardingDone } = parsed.data

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { ...(name !== undefined && { name }) },
      select: { id: true, name: true, email: true },
    }),
    prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...(timezone !== undefined && { timezone }),
        ...(bio !== undefined && { bio }),
        ...(onboardingDone !== undefined && { onboardingDone }),
      },
      update: {
        ...(timezone !== undefined && { timezone }),
        ...(bio !== undefined && { bio }),
        ...(onboardingDone !== undefined && { onboardingDone }),
      },
    }),
  ])

  return NextResponse.json({ ok: true, data: user })
}

const deleteSchema = z.object({
  confirmation: z.literal('confirm-delete'),
})

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = deleteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Confirmation required: send { "confirmation": "confirm-delete" }' }, { status: 422 })
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  })

  return NextResponse.json({ ok: true })
}
