import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'
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

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Silent success to prevent account harvesting
      return NextResponse.json({ ok: true })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetLink = `${appUrl}/auth/reset-password/confirm?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send email
    await sendEmail({
      to: email,
      subject: 'Reset your Aumveda Password',
      text: `Reset your password by visiting this link: ${resetLink}. Valid for 1 hour.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #1A0F3C; text-align: center;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #1A0F3C; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 1px solid #C9A84C;">
              Reset Password
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">This link is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #999; word-break: break-all;">Link: ${resetLink}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('PASSWORD RESET REQUEST ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
