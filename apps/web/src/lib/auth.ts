import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'
import { headers } from 'next/headers'
import crypto from 'crypto'
import type { UserRole } from '@aumveda/types'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/onboarding/step-1',
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@aumveda.com',
    }),

    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otpCode: { label: 'OTP Code', type: 'text' },
        action: { label: 'Action', type: 'text' }, // 'password' or 'otp'
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error('Missing email')
          }

          const email = credentials.email.toLowerCase().trim()

          // ─── OTP ACTION ───────────────────────────────────────────
          if (credentials.action === 'otp') {
            if (!credentials.otpCode) {
              throw new Error('Missing OTP code')
            }

            const user = await prisma.user.findUnique({
              where: { email },
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
                role: true,
                otpCode: true,
                otpExpires: true,
              },
            })

            if (!user || !user.otpCode || !user.otpExpires) {
              throw new Error('OTP not requested or invalid')
            }

            if (new Date() > user.otpExpires) {
              throw new Error('OTP has expired')
            }

            if (user.otpCode !== credentials.otpCode.trim()) {
              throw new Error('Invalid OTP code')
            }

            // Clear OTP to prevent reuse
            await prisma.user.update({
              where: { id: user.id },
              data: { otpCode: null, otpExpires: null },
            })

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: (user.role === 'user' ? 'client' : user.role) as UserRole,
            }
          }

          // ─── PASSWORD ACTION ──────────────────────────────────────
          if (!credentials.password) {
            throw new Error('Missing password')
          }

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              role: true,
              passwordHash: true,
              emailVerified: true,
            },
          })

          if (!user) {
            throw new Error('User not found')
          }

          if (!user.passwordHash) {
            throw new Error('This account uses Google or magic link sign-in')
          }

          // Enforce email verification for credentials provider signup
          if (!user.emailVerified) {
            throw new Error('email_not_verified')
          }

          const validPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!validPassword) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: (user.role === 'user' ? 'client' : user.role) as UserRole,
          }
        } catch (error: any) {
          console.error('AUTH AUTHORIZE ERROR:', error)
          // Rethrow to pass the specific error message (e.g. 'email_not_verified') to the frontend
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Runs on initial sign-in only
      if (user) {
        token.id = user.id
        const rawRole = (user as any).role || 'client'
        token.role = (rawRole === 'user' ? 'client' : rawRole) as UserRole

        // Capture request metadata
        let userAgent = 'Unknown'
        let ipAddress = '127.0.0.1'
        try {
          const headersList = headers()
          userAgent = headersList.get('user-agent') || 'Unknown'
          ipAddress =
            headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            '127.0.0.1'
        } catch (e) {
          // Ignore headers() errors when out of request scope
        }

        // Generate a new session row in the database
        const sessionToken = crypto.randomUUID()
        try {
          await prisma.session.create({
            data: {
              sessionToken,
              userId: user.id,
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              userAgent,
              ipAddress,
            },
          })
          token.sessionToken = sessionToken
        } catch (dbError) {
          console.error('FAILED TO CREATE SESSION RECORD:', dbError)
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user && token.sessionToken) {
        // Enforce session database check for device management & revocation
        try {
          const dbSession = await prisma.session.findUnique({
            where: { sessionToken: token.sessionToken as string },
          })

          if (!dbSession) {
            // Revoked session! Return null to force NextAuth logout
            return null as any
          }
        } catch (dbError) {
          console.error('FAILED TO VALIDATE SESSION IN DB:', dbError)
        }

        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }

      return session
    },

    async signIn({ user, account }) {
      try {
        if (account?.type === 'oauth' || account?.type === 'email') {
          const existingProfile = await prisma.profile.findUnique({
            where: { userId: user.id },
          })

          if (!existingProfile) {
            await prisma.profile.create({
              data: { userId: user.id },
            })
          }
        }
        return true
      } catch (error) {
        console.error('SIGNIN CALLBACK ERROR:', error)
        return false
      }
    },
  },

  events: {
    async createUser({ user }) {
      try {
        await prisma.event.create({
          data: {
            userId: user.id,
            eventName: 'sign_up',
            payload: { email: user.email },
            source: 'server',
          },
        })
      } catch (error) {
        console.error('CREATE USER EVENT ERROR:', error)
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
}