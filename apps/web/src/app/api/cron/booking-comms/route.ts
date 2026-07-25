import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@aumveda/db'
import {
  BookingLifecycleEvent,
  hasLifecycleEvent,
  nextIcsSequence,
  recordLifecycleEvent,
} from '@/lib/booking-lifecycle'
import {
  sendBookingReminderEmail,
  sendBookingThankYouEmail,
} from '@/lib/booking-comms'

/**
 * Cron / scheduler entry for booking lifecycle communications.
 * Auth: Authorization: Bearer $CRON_SECRET  (or x-cron-secret header)
 *
 * Intended cadence: every 15 minutes.
 * - 24h reminders (window 23–25h before start)
 * - 1h reminders (window 50–70m before start)
 * - Thank-you + mark completed (30m–48h after end)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 503 }
    )
  }

  const auth = req.headers.get('authorization') || ''
  const headerSecret = req.headers.get('x-cron-secret') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (bearer !== secret && headerSecret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = Date.now()
  const siteUrl = process.env.NEXTAUTH_URL || 'https://aumveda.com'
  const summary = {
    reminder24h: 0,
    reminder1h: 0,
    thankYou: 0,
    errors: 0,
  }

  // ── 24h reminders ──────────────────────────────────────────
  const rem24Start = new Date(now + 23 * 3600_000)
  const rem24End = new Date(now + 25 * 3600_000)
  const due24 = await prisma.booking.findMany({
    where: {
      status: 'confirmed',
      bookingDatetime: { gte: rem24Start, lte: rem24End },
    },
    include: { user: { select: { email: true, name: true } } },
    take: 50,
  })

  for (const b of due24) {
    if (!b.user.email) continue
    if (await hasLifecycleEvent(b.id, BookingLifecycleEvent.REMINDER_24H)) continue
    try {
      const sequence = await nextIcsSequence(b.id)
      const mail = await sendBookingReminderEmail({
        to: b.user.email,
        clientName: b.user.name?.split(' ')[0] || 'friend',
        bookingId: b.id,
        practitioner: b.practitioner,
        serviceType: b.serviceType,
        bookingDatetime: b.bookingDatetime,
        durationMinutes: b.durationMinutes,
        kind: '24h',
        sequence,
        siteUrl,
      })
      await recordLifecycleEvent({
        userId: b.userId,
        eventName: BookingLifecycleEvent.REMINDER_24H,
        bookingId: b.id,
        payload: { simulated: mail.simulated },
      })
      summary.reminder24h++
    } catch (err) {
      console.error('REMINDER 24H FAILED', b.id, err)
      summary.errors++
    }
  }

  // ── 1h reminders ───────────────────────────────────────────
  const rem1Start = new Date(now + 50 * 60_000)
  const rem1End = new Date(now + 70 * 60_000)
  const due1 = await prisma.booking.findMany({
    where: {
      status: 'confirmed',
      bookingDatetime: { gte: rem1Start, lte: rem1End },
    },
    include: { user: { select: { email: true, name: true } } },
    take: 50,
  })

  for (const b of due1) {
    if (!b.user.email) continue
    if (await hasLifecycleEvent(b.id, BookingLifecycleEvent.REMINDER_1H)) continue
    try {
      const sequence = await nextIcsSequence(b.id)
      const mail = await sendBookingReminderEmail({
        to: b.user.email,
        clientName: b.user.name?.split(' ')[0] || 'friend',
        bookingId: b.id,
        practitioner: b.practitioner,
        serviceType: b.serviceType,
        bookingDatetime: b.bookingDatetime,
        durationMinutes: b.durationMinutes,
        kind: '1h',
        sequence,
        siteUrl,
      })
      await recordLifecycleEvent({
        userId: b.userId,
        eventName: BookingLifecycleEvent.REMINDER_1H,
        bookingId: b.id,
        payload: { simulated: mail.simulated },
      })
      summary.reminder1h++
    } catch (err) {
      console.error('REMINDER 1H FAILED', b.id, err)
      summary.errors++
    }
  }

  // ── Thank-you (completed) ──────────────────────────────────
  // Ended between 30 minutes and 48 hours ago
  const endEarliest = new Date(now - 48 * 3600_000)
  const candidates = await prisma.booking.findMany({
    where: {
      status: 'confirmed',
      bookingDatetime: { gte: endEarliest, lt: new Date(now) },
    },
    include: { user: { select: { email: true, name: true } } },
    take: 50,
  })

  for (const b of candidates) {
    const endAt = b.bookingDatetime.getTime() + b.durationMinutes * 60_000
    if (endAt > now - 30 * 60_000) continue // still within / just after session
    if (await hasLifecycleEvent(b.id, BookingLifecycleEvent.THANK_YOU)) {
      if (b.status !== 'completed') {
        await prisma.booking.update({
          where: { id: b.id },
          data: { status: 'completed' },
        })
      }
      continue
    }
    if (!b.user.email) continue

    try {
      const mail = await sendBookingThankYouEmail({
        to: b.user.email,
        clientName: b.user.name?.split(' ')[0] || 'friend',
        bookingId: b.id,
        practitioner: b.practitioner,
        serviceType: b.serviceType,
        bookingDatetime: b.bookingDatetime,
        siteUrl,
      })
      await prisma.booking.update({
        where: { id: b.id },
        data: { status: 'completed' },
      })
      await recordLifecycleEvent({
        userId: b.userId,
        eventName: BookingLifecycleEvent.THANK_YOU,
        bookingId: b.id,
        payload: { simulated: mail.simulated },
      })
      summary.thankYou++
    } catch (err) {
      console.error('THANK YOU FAILED', b.id, err)
      summary.errors++
    }
  }

  return NextResponse.json({ ok: true, ...summary })
}

/** Allow GET for simple uptime pings with same auth (Vercel cron often uses GET). */
export async function GET(req: NextRequest) {
  return POST(req)
}
