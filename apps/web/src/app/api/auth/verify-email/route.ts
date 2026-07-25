import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { email, token } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        verificationToken: true,
        verificationTokenExpires: true,
      },
    })

    if (!user || !user.verificationToken || !user.verificationTokenExpires) {
      return NextResponse.json({ error: 'Verification link is invalid or expired' }, { status: 400 })
    }

    if (new Date() > user.verificationTokenExpires) {
      return NextResponse.json({ error: 'Verification link has expired' }, { status: 400 })
    }

    if (user.verificationToken !== token) {
      return NextResponse.json({ error: 'Verification link is invalid' }, { status: 400 })
    }

    // Mark email as verified and clear tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('EMAIL VERIFICATION ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
