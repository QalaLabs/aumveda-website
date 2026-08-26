import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'server-only'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function shouldUseSsl(connectionString: string | undefined): boolean {
  if (!connectionString) return false
  if (/sslmode=disable/i.test(connectionString)) return false
  if (/localhost|127\.0\.0\.1/i.test(connectionString)) return false
  // Supabase / cloud poolers typically need TLS
  return true
}

function createPrismaClient() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  const pool = new Pool({
    connectionString,
    ...(shouldUseSsl(connectionString)
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
    connectionTimeoutMillis: 10000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export * from '@prisma/client'