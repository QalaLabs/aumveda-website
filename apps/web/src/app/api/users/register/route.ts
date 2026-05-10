import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

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
          error:
            parsed.error.issues[0]?.message ??
            'Invalid input',
        },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    console.log('[REGISTER ATTEMPT]', email)

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            'An account with this email already exists.',
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      12
    )

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,

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
      console.error(
        'EVENT CREATION ERROR:',
        eventError
      )
    }

    console.log('[REGISTER SUCCESS]', user.email)

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
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 }
    )
  }
}