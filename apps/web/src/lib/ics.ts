/** Build a VEVENT ICS for Discovery Call / session booking */

export function buildBookingIcs(opts: {
  uid: string
  title: string
  description: string
  start: Date
  durationMinutes: number
  organizerEmail?: string
  attendeeEmail: string
  attendeeName?: string
}): string {
  const end = new Date(opts.start.getTime() + opts.durationMinutes * 60_000)
  const stamp = formatIcsUtc(new Date())
  const dtStart = formatIcsUtc(opts.start)
  const dtEnd = formatIcsUtc(end)
  const desc = escapeIcs(opts.description)
  const summary = escapeIcs(opts.title)
  const org = opts.organizerEmail || 'sessions@aumveda.com'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AUMVEDA//Discovery Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@aumveda.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `ORGANIZER;CN=AUMVEDA:mailto:${org}`,
    `ATTENDEE;CN=${escapeIcs(opts.attendeeName || 'Guest')};RSVP=TRUE:mailto:${opts.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function formatIcsUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}
