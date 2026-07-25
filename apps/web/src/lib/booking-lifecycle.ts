import { prisma } from '@aumveda/db'

/** Canonical booking lifecycle event names (auditable via Event table). */
export const BookingLifecycleEvent = {
  CONFIRMED: 'booking.confirmed',
  CANCELLED: 'booking.cancelled',
  RESCHEDULED: 'booking.rescheduled',
  REMINDER_24H: 'booking.reminder.24h',
  REMINDER_1H: 'booking.reminder.1h',
  THANK_YOU: 'booking.thank_you',
  PRACTITIONER_NOTIFIED: 'booking.notify.practitioner',
  ADMIN_NOTIFIED: 'booking.notify.admin',
} as const

export type BookingLifecycleEventName =
  (typeof BookingLifecycleEvent)[keyof typeof BookingLifecycleEvent]

/** Active statuses eligible for cancel / reschedule / reminders */
export const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed'] as const

export async function hasLifecycleEvent(
  bookingId: string,
  eventName: BookingLifecycleEventName
): Promise<boolean> {
  const row = await prisma.event.findFirst({
    where: {
      eventName,
      payload: { path: ['bookingId'], equals: bookingId },
    },
    select: { id: true },
  })
  return Boolean(row)
}

export async function recordLifecycleEvent(opts: {
  userId: string
  eventName: BookingLifecycleEventName
  bookingId: string
  payload?: Record<string, unknown>
}): Promise<void> {
  await prisma.event.create({
    data: {
      userId: opts.userId,
      eventName: opts.eventName,
      payload: {
        bookingId: opts.bookingId,
        ...opts.payload,
      },
      source: 'server',
    },
  })
}

/**
 * ICS SEQUENCE: 0 at create; +1 per reschedule or cancel.
 * Idempotent reads — derived from audit events, no schema change.
 */
export async function nextIcsSequence(bookingId: string): Promise<number> {
  const updates = await prisma.event.count({
    where: {
      eventName: {
        in: [BookingLifecycleEvent.RESCHEDULED, BookingLifecycleEvent.CANCELLED],
      },
      payload: { path: ['bookingId'], equals: bookingId },
    },
  })
  return updates
}

export function practitionerNotifyEmail(practitioner: string): string | null {
  const key = practitioner.toLowerCase()
  if (key === 'sejal') return process.env.SEJAL_NOTIFY_EMAIL || process.env.PRACTITIONER_NOTIFY_EMAIL || null
  if (key === 'archana')
    return process.env.ARCHANA_NOTIFY_EMAIL || process.env.PRACTITIONER_NOTIFY_EMAIL || null
  return process.env.PRACTITIONER_NOTIFY_EMAIL || null
}

export function adminNotifyEmail(): string | null {
  return process.env.ADMIN_NOTIFY_EMAIL || null
}
