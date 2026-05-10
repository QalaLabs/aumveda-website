import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@aumveda/db'
import bcrypt from 'bcryptjs'

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
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        try {
          console.log('LOGIN ATTEMPT:', credentials?.email)

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing email or password')
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase(),
            },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              role: true,
              passwordHash: true,
            },
          })

          if (!user) {
            throw new Error('User not found')
          }

          if (!user.passwordHash) {
            throw new Error(
              'This account uses Google or magic link sign-in'
            )
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
            role: user.role,
          }
        } catch (error) {
          console.error('AUTH ERROR:', error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) || 'user'
      }

      return session
    },

    async signIn({ user, account }) {
      try {
        if (
          account?.type === 'oauth' ||
          account?.type === 'email'
        ) {
          const existingProfile =
            await prisma.profile.findUnique({
              where: {
                userId: user.id,
              },
            })

          if (!existingProfile) {
            await prisma.profile.create({
              data: {
                userId: user.id,
              },
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
            payload: {
              email: user.email,
            },
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