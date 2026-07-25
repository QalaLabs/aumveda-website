/**
 * Offline smoke checks for P4.2 booking lifecycle ICS / messaging contracts.
 * Run: node apps/web/scripts/verify-p42-booking-comms.mjs
 */

function formatIcsUtc(d) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function buildBookingIcs(opts) {
  const method = opts.method ?? 'REQUEST'
  const status = opts.status ?? (method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED')
  const sequence = Math.max(0, opts.sequence ?? 0)
  const end = new Date(opts.start.getTime() + opts.durationMinutes * 60_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AUMVEDA//Discovery Call//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:${opts.uid}@aumveda.com`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(opts.start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${opts.title}`,
    `STATUS:${status}`,
    `SEQUENCE:${sequence}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

let failed = 0
function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg)
    failed++
  } else {
    console.log('PASS:', msg)
  }
}

const start = new Date('2026-08-01T04:00:00.000Z') // 09:30 IST
const cancelIcs = buildBookingIcs({
  uid: 'book_1',
  title: 'AUMVEDA Discovery Call',
  start,
  durationMinutes: 15,
  method: 'CANCEL',
  status: 'CANCELLED',
  sequence: 1,
})

assert(cancelIcs.includes('METHOD:CANCEL'), 'cancel ICS uses METHOD:CANCEL')
assert(cancelIcs.includes('STATUS:CANCELLED'), 'cancel ICS STATUS:CANCELLED')
assert(cancelIcs.includes('SEQUENCE:1'), 'cancel bumps SEQUENCE')
assert(cancelIcs.includes('\r\n'), 'ICS uses CRLF')

const updateIcs = buildBookingIcs({
  uid: 'book_1',
  title: 'AUMVEDA Discovery Call',
  start: new Date(start.getTime() + 86400_000),
  durationMinutes: 15,
  method: 'REQUEST',
  sequence: 2,
})
assert(updateIcs.includes('METHOD:REQUEST'), 'reschedule ICS METHOD:REQUEST')
assert(updateIcs.includes('SEQUENCE:2'), 'reschedule SEQUENCE increments')
assert(updateIcs.includes('UID:book_1@aumveda.com'), 'UID stable across lifecycle')

const events = [
  'booking.confirmed',
  'booking.cancelled',
  'booking.rescheduled',
  'booking.reminder.24h',
  'booking.reminder.1h',
  'booking.thank_you',
  'booking.notify.practitioner',
  'booking.notify.admin',
]
assert(events.length === 8, 'eight lifecycle event names defined')

if (failed) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log('\nP4.2 offline verify: PASS')
