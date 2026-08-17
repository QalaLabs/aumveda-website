import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? 'Invalid input',
        },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists.',
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: 'client', // Default role is client
        verificationToken,
        verificationTokenExpires,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // Send verification email
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const verifyLink = `${appUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`

      await sendEmail({
        to: normalizedEmail,
        subject: 'Verify your Aumveda Account',
        text: `Welcome to Aumveda, ${name}! Please verify your email by clicking: ${verifyLink}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #1A0F3C; text-align: center;">Welcome to Aumveda!</h2>
            <p>Hello ${name},</p>
            <p>Thank you for starting your healing journey. Please verify your email address to activate your account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyLink}" style="background-color: #1A0F3C; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 1px solid #C9A84C;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">This link is valid for 24 hours. If you did not sign up for an account, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 11px; color: #999; word-break: break-all;">Link: ${verifyLink}</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('FAILED TO SEND VERIFICATION EMAIL:', emailError)
    }

    // Create signup event safely
    try {
      await prisma.event.create({
        data: {
          userId: user.id,
          eventName: 'sign_up',
          payload: {
            email: user.email,
            method: 'credentials',
          },
          source: 'server',
        },
      })
    } catch (eventError) {
      console.error('EVENT CREATION ERROR:', eventError)
    }

    return NextResponse.json(
      {
        ok: true,
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('REGISTER ROUTE ERROR:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}