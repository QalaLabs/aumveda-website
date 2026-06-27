import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authOptions } from '@/lib/auth'
import { prisma } from '@aumveda/db'
import { createServerClient } from '@supabase/ssr'

/**
 * Returns a real NextAuth session in production.
 * In development, auto-logs in as the dev@aumveda.com user (no password needed).
 * Always redirects to /auth/login if no session can be established.
 */
export async function requireSession() {
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS === 'true') {
    // Look up (or create) the dev user and return a mock session
    let user = await prisma.user.findUnique({ where: { email: 'dev@aumveda.com' } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'dev@aumveda.com',
          name: 'Dev User',
          emailVerified: new Date(),
          role: 'user',
          profile: {
            create: {
              timezone: 'Asia/Kolkata',
              onboardingDone: true,
              progress: 42,
              streakDays: 3,
            },
          },
        },
      })
      // Seed a sample journal
      await prisma.journal.create({
        data: {
          userId: user.id,
          title: 'First reflection',
          body: 'Today I started my healing journey with Aumveda. I feel a quiet sense of hope.',
          mood: 4,
          tags: ['gratitude', 'hope'],
        },
      }).catch(() => null)
      await prisma.achievement.upsert({
        where: { userId_key: { userId: user.id, key: 'FIRST_JOURNAL' } },
        create: { userId: user.id, key: 'FIRST_JOURNAL' },
        update: {},
      }).catch(() => null)
    } else {
      // Ensure profile exists
      await prisma.profile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, timezone: 'Asia/Kolkata', onboardingDone: true, progress: 42, streakDays: 3 },
        update: {},
      })
    }

    return {
      user: {
        id: user.id,
        email: user.email!,
        name: user.name ?? 'Dev User',
        role: (user.role ?? 'user') as 'user' | 'admin',
      },
      expires: new Date(Date.now() + 86400_000).toISOString(),
    }
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login')
  return session
}

/**
 * Returns a Supabase Auth session (used during NextAuth→Supabase migration).
 * Falls back to NextAuth if Supabase session missing.
 */
export async function getSupabaseSession() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    },
  )
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * Requires an admin/practitioner session. Checks NextAuth first, then Supabase.
 */
export async function requireAdminSession() {
  // Try NextAuth first (current auth)
  const nextAuthSession = await getServerSession(authOptions)
  if (nextAuthSession?.user?.role === 'admin') {
    return nextAuthSession
  }

  // Fallback to Supabase (migration path)
  const supabaseSession = await getSupabaseSession()
  if (!supabaseSession?.user) redirect('/auth/login')

  const user = await prisma.user.findUnique({
    where: { email: supabaseSession.user.email! },
    select: { id: true, role: true },
  })
  if (user?.role !== 'admin') redirect('/auth/login')

  return {
    user: { id: user.id, email: supabaseSession.user.email!, name: supabaseSession.user.user_metadata?.name ?? null, role: user.role as 'user' | 'admin' },
    expires: supabaseSession.expires_at ? new Date(supabaseSession.expires_at * 1000).toISOString() : '',
  }
}
