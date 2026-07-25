import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid email' }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase().trim()

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Upsert User (creates client profile if it doesn't exist)
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        role: 'client',
        emailVerified: new Date(), // OTP verify automatically verifies email
        otpCode,
        otpExpires,
        profile: {
          create: {},
        },
      },
      update: {
        otpCode,
        otpExpires,
      },
    })

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Your Aumveda Verification Code',
      text: `Your login code is: ${otpCode}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
          <h2 style="color: #1A0F3C; text-align: center;">Welcome to Aumveda</h2>
          <p>Please use the following verification code to sign in to your account:</p>
          <div style="background-color: #f7f5fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #C9A84C; margin: 20px 0; border-radius: 8px;">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #666;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('OTP SEND ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
