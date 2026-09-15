import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { z } from 'zod'
import crypto from 'crypto'

const verifySchema = z.object({
  email: z.string().email(),
  otpCode: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = verifySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request payload' },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const otpCode = parsed.data.otpCode.trim()

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        otpCode: true,
        otpExpires: true,
      },
    })

    if (!user || !user.otpCode || !user.otpExpires) {
      return NextResponse.json(
        { error: 'No verification code requested for this email. Please request a new code.' },
        { status: 400 }
      )
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      )
    }

    if (user.otpCode !== otpCode) {
      return NextResponse.json(
        { error: 'Incorrect verification code. Please check and try again.' },
        { status: 400 }
      )
    }

    // Mark user as verified and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        otpCode: null,
        otpExpires: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // Generate session token
    const sessionToken = crypto.randomUUID()
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    const userAgent = req.headers.get('user-agent') || undefined
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      undefined

    try {
      await prisma.session.create({
        data: {
          sessionToken,
          userId: updatedUser.id,
          expires: sessionExpires,
          userAgent,
          ipAddress,
        },
      })
    } catch (sessionErr) {
      console.warn('Could not persist session record to database:', sessionErr)
    }

    const response = NextResponse.json({
      ok: true,
      sessionToken,
      user: updatedUser,
      message: 'Email successfully verified',
    })

    const cookieName =
      process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL?.startsWith('http://localhost')
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'

    response.cookies.set({
      name: cookieName,
      value: sessionToken,
      expires: sessionExpires,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error: any) {
    console.error('OTP VERIFY ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
