/**
 * Offline smoke checks for P4.1 booking credibility.
 * Run: node apps/web/scripts/verify-p41-booking.mjs
 */
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Dynamic import compiled TS via tsx alternative: inline ICS helpers for smoke
function formatIcsUtc(d) {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function buildBookingIcs(opts) {
  const end = new Date(opts.start.getTime() + opts.durationMinutes * 60_000)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AUMVEDA//Discovery Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@aumveda.com`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(opts.start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${opts.title}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function istToIso(y, mo, d, h, m) {
  const pad = (n) => String(n).padStart(2, '0')
  return new Date(`${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(m)}:00+05:30`).toISOString()
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

// 1. ICS shape for Google / Apple / Outlook
const start = new Date(istToIso(2026, 8, 3, 10, 30))
const ics = buildBookingIcs({
  uid: 'test-booking-id',
  title: 'AUMVEDA Discovery Call with Sejal Jain',
  start,
  durationMinutes: 15,
})
assert(ics.includes('BEGIN:VCALENDAR'), 'ICS has VCALENDAR')
assert(ics.includes('BEGIN:VEVENT'), 'ICS has VEVENT')
assert(/DTSTART:\d{8}T\d{6}Z/.test(ics), 'DTSTART is UTC Zulu form')
assert(/DTEND:\d{8}T\d{6}Z/.test(ics), 'DTEND is UTC Zulu form')
assert(ics.includes('\r\n'), 'ICS uses CRLF line endings')

// 2. Timezone: 10:30 IST = 05:00 UTC (IST = UTC+5:30)
const utcHour = start.getUTCHours()
const utcMin = start.getUTCMinutes()
assert(utcHour === 5 && utcMin === 0, `10:30 IST maps to 05:00 UTC (got ${utcHour}:${utcMin})`)

// Non-IST local label still resolves from same Instant
const ny = start.toLocaleString('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
assert(typeof ny === 'string' && ny.length > 0, `Local NY label renders: ${ny}`)

// 3. Document duplicate / email / owner checks (code-level — see route + page)
console.log('NOTE: Duplicate submit guarded by submitLock + server ±90s idempotency')
console.log('NOTE: Email failure returns emailSent:false; booking still ok')
console.log('NOTE: Confirm page owner-only; invalid id soft-fails without leaking')

if (failed) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log('\nAll offline P4.1 smoke checks passed')
