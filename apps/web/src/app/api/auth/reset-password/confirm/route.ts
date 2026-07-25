import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { email, token, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        resetToken: true,
        resetTokenExpires: true,
      },
    })

    if (!user || !user.resetToken || !user.resetTokenExpires) {
      return NextResponse.json({ error: 'Password reset link is invalid or expired' }, { status: 400 })
    }

    if (new Date() > user.resetTokenExpires) {
      return NextResponse.json({ error: 'Password reset link has expired' }, { status: 400 })
    }

    if (user.resetToken !== token) {
      return NextResponse.json({ error: 'Password reset link is invalid' }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12)

    // Update password, clear tokens, and mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
        emailVerified: new Date(), // verified when reset succeeds
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('PASSWORD RESET CONFIRM ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
