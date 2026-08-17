import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isAdminRole } from '@/lib/admin-auth'
import { prisma } from '@aumveda/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

interface LeadPayload {
  email?: string
  name?: string
  tool?: string
  source?: string
  [key: string]: unknown
}

export async function GET(request: NextRequest) {
  try {
    const session = await getApiSession()
    if (!session?.user?.id || !isAdminRole(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      search: searchParams.get('search') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    const where = { eventName: 'lead_magnet' }

    const allLeads = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const filtered = query.search
      ? allLeads.filter((lead) => {
          const p = lead.payload as LeadPayload
          const searchLower = query.search!.toLowerCase()
          return (
            (p.email?.toLowerCase().includes(searchLower) ?? false) ||
            (p.name?.toLowerCase().includes(searchLower) ?? false)
          )
        })
      : allLeads

    const total = filtered.length
    const skip = (query.page - 1) * query.limit
    const paged = filtered.slice(skip, skip + query.limit)

    return NextResponse.json({
      success: true,
      leads: paged.map((lead) => {
        const p = lead.payload as LeadPayload
        return {
          id: lead.eventId,
          name: p.name ?? null,
          email: p.email ?? null,
          tool: p.tool ?? null,
          source: p.source ?? null,
          createdAt: lead.createdAt,
        }
      }),
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch (err: unknown) {
    console.error('[api/admin/leads] GET error:', err)
    return NextResponse.json({ error: 'Failed to load leads' }, { status: 500 })
  }
}
