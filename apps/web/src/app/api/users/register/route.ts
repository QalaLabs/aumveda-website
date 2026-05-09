import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { supabaseAdmin, supabaseAdminConfigured } from '@/lib/supabase'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const { name, email, password } = parsed.data

  console.log('[register] DB_URL prefix:', process.env.DATABASE_URL?.slice(0, 60))

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    if (!supabaseAdminConfigured) {
      return NextResponse.json({ error: 'Auth service is not configured. Please contact support.' }, { status: 503 })
    }

    // Create user in Supabase Auth
    console.log('Creating Supabase user for:', email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error('No user returned from Supabase signup')
      return NextResponse.json({ error: 'Failed to create auth user.' }, { status: 500 })
    }

    console.log('Supabase user created:', authData.user.id)

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: { create: {} },
      },
      select: { id: true, email: true, name: true },
    })

    await prisma.event.create({
      data: {
        userId: user.id,
        eventName: 'sign_up',
        payload: { email: user.email, method: 'credentials' },
        source: 'server',
      },
    })

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
