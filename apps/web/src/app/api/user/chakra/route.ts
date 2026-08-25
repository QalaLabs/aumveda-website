import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'

export const dynamic = 'force-dynamic'

/**
 * Lightweight endpoint exposing just the logged-in user's chakra so client
 * components (product pages, shop) can personalize without pulling in the
 * full dashboard session payload. Returns { chakra: null } when logged out
 * or no portal data exists yet — never an error, so callers can render the
 * unpersonalized state without special-casing.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ chakra: null })
  }

  const portalData = await prisma.userPortalData.findUnique({
    where: { userId: session.user.id },
    select: { chakraSelected: true },
  })

  return NextResponse.json({ chakra: portalData?.chakraSelected ?? null })
}
