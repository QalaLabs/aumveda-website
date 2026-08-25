import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'

// TODO: integrate with billing/subscription system — do not implement here.
// This stub exists only so the community tier banner's "Upgrade" button has
// somewhere to POST. Do not wire real payment/subscription logic into this
// route without going through the billing/payment module.
export async function POST() {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(
    { ok: false, error: 'not_implemented', message: 'TODO: wire to billing' },
    { status: 501 }
  )
}
