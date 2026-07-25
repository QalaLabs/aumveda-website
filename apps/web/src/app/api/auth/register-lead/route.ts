import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { email, name, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Check if the user already exists (Step 6 email capture creates them)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      // If the user already has a password, they are already registered
      if (existingUser.passwordHash) {
        return NextResponse.json(
          { error: 'An account with this email is already fully registered.' },
          { status: 409 }
        )
      }

      // Upgrade lead to active client
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          passwordHash,
          role: 'client',
          emailVerified: new Date(), // verified upon password setup
        },
      })
    } else {
      // Create new user (fallback case if they bypassed step 6 somehow)
      await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          role: 'client',
          emailVerified: new Date(),
          profile: {
            create: {},
          },
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('REGISTER LEAD ROUTE ERROR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
