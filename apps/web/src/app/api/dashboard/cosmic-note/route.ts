import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'

/** GET /api/dashboard/cosmic-note — latest published weekly note */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const note = await prisma.cosmicNote.findFirst({
    where: { isPublished: true },
    orderBy: [{ publishedAt: 'desc' }, { weekOf: 'desc' }],
    select: {
      id: true,
      title: true,
      body: true,
      weekOf: true,
      publishedAt: true,
    },
  })

  return NextResponse.json({ success: true, note })
}
