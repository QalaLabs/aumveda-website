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
  // Runtime queries must go through the pooler (DATABASE_URL, port 6543 / pgbouncer=true).
  // DIRECT_URL (port 5432, unpooled) is for `prisma migrate` only — using it here would
  // open one raw Postgres connection per serverless/Cloud Run instance and exhaust the
  // database's connection limit under concurrent load.
  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL
  const pool = new Pool({
    connectionString,
    ...(shouldUseSsl(connectionString)
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
    connectionTimeoutMillis: 10000,
    // Keep this well under the pooler's per-client connection budget — each
    // container instance gets its own pool, so a high max here multiplies fast.
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30000,
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