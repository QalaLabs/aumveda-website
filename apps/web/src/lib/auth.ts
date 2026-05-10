import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/onboarding/step-1',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM ?? 'noreply@aumveda.com',
    }),
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
  console.log('LOGIN ATTEMPT', credentials?.email)

  if (!credentials?.email || !credentials?.password) {
    console.log('MISSING CREDENTIALS')
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      passwordHash: true,
    },
  })

  console.log('USER FOUND:', !!user)
  console.log('HAS HASH:', !!user?.passwordHash)

  if (!user?.passwordHash) {
    console.log('NO PASSWORD HASH')
    return null
  }

  const valid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  )

  console.log('PASSWORD VALID:', valid)

  if (!valid) {
    console.log('INVALID PASSWORD')
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role as 'user' | 'admin',
  }
},
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, `user` is populated — persist id and role into the token
      if (user) {
        token.id = user.id
        token.role = (user as { role?: 'user' | 'admin' }).role ?? 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'user' | 'admin') ?? 'user'
      }
      return session
    },
    async signIn({ user, account }) {
      // Ensure a Profile row exists for OAuth / email sign-ins
      if (account?.type === 'oauth' || account?.type === 'email') {
        const existing = await prisma.profile.findUnique({ where: { userId: user.id } })
        if (!existing) {
          await prisma.profile.create({ data: { userId: user.id } })
        }
      }
      return true
    },
  },
  events: {
    async createUser({ user }) {
      // Emit sign_up event
      await prisma.event.create({
        data: {
          userId: user.id,
          eventName: 'sign_up',
          payload: { email: user.email },
          source: 'server',
        },
      })
    },
  },
}
