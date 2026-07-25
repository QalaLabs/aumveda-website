import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

async function getOwned(session: { user: { id: string } }, id: number) {
  return prisma.journal.findFirst({ where: { id, userId: session.user.id } })
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const journal = await getOwned(session, id)
  if (!journal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ ok: true, data: journal })
}

const patchSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(10000).optional(),
  mood: z.number().int().min(1).max(5).nullable().optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  voiceNoteUrl: z.string().nullable().optional(),
  aiReflection: z.string().nullable().optional(),
  practitionerVisible: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const existing = await getOwned(session, id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const journal = await prisma.journal.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.body !== undefined && { body: parsed.data.body }),
      ...(parsed.data.mood !== undefined && { mood: parsed.data.mood }),
      ...(parsed.data.tags !== undefined && { tags: parsed.data.tags }),
      ...(parsed.data.voiceNoteUrl !== undefined && { voiceNoteUrl: parsed.data.voiceNoteUrl }),
      ...(parsed.data.aiReflection !== undefined && { aiReflection: parsed.data.aiReflection }),
      ...(parsed.data.practitionerVisible !== undefined && { practitionerVisible: parsed.data.practitionerVisible }),
    },
    select: { id: true, title: true, updatedAt: true },
  })

  prisma.event.create({
    data: {
      userId: session.user.id,
      eventName: 'journal.edited',
      payload: { journalId: id },
      source: 'server',
    },
  }).catch(() => null)

  return NextResponse.json({ ok: true, data: journal })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const existing = await getOwned(session, id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.journal.delete({ where: { id } })

  prisma.event.create({
    data: {
      userId: session.user.id,
      eventName: 'journal.deleted',
      payload: { journalId: id },
      source: 'server',
    },
  }).catch(() => null)

  return NextResponse.json({ ok: true })
}
