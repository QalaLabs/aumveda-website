import { sendEmail } from '@/lib/email'
import { buildBookingIcs } from '@/lib/ics'
import {
  adminNotifyEmail,
  practitionerNotifyEmail,
} from '@/lib/booking-lifecycle'

const PRACTITIONER_LABEL: Record<string, string> = {
  sejal: 'Sejal Jain',
  archana: 'Archana Jain',
}

function practitionerName(key: string) {
  return PRACTITIONER_LABEL[key] || key
}

function formatWhenIst(d: Date) {
  return d.toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  })
}

function siteBase(siteUrl?: string) {
  return (siteUrl || process.env.NEXTAUTH_URL || 'https://aumveda.com').replace(/\/$/, '')
}

function sessionsUrl(siteUrl?: string) {
  return `${siteBase(siteUrl)}/dashboard/appointments`
}

function isDiscovery(serviceType: string) {
  return serviceType === 'discovery_call' || serviceType.toLowerCase().includes('discovery')
}

function sessionTitle(serviceType: string, name: string) {
  return isDiscovery(serviceType)
    ? `AUMVEDA Discovery Call with ${name}`
    : `AUMVEDA session with ${name}`
}

function wrapEditorial(opts: {
  eyebrow: string
  headline: string
  greeting: string
  bodyHtml: string
  ctaHref?: string
  ctaLabel?: string
}): string {
  const cta =
    opts.ctaHref && opts.ctaLabel
      ? `<p style="margin:28px 0 0;text-align:center;">
            <a href="${escapeHtml(opts.ctaHref)}" style="display:inline-block;padding:14px 28px;background:#1C1917;color:#E8D5A3;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;border-radius:999px;">${escapeHtml(opts.ctaLabel)}</a>
          </p>`
      : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Georgia,'Times New Roman',serif;color:#1C1917;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F0E8;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:28px;text-align:center;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#A67C2D;">AUMVEDA</p>
        </td></tr>
        <tr><td style="background:#FAF7F2;border:1px solid #E8E0D4;padding:40px 36px;">
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#A67C2D;">${escapeHtml(opts.eyebrow)}</p>
          <h1 style="margin:0 0 20px;font-size:28px;font-weight:400;line-height:1.25;color:#1C1917;">${escapeHtml(opts.headline)}</h1>
          <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.6;color:#57534E;">${escapeHtml(opts.greeting)}</p>
          ${opts.bodyHtml}
          ${cta}
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#A8A29E;">With care — Archana &amp; Sejal</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export type CommsResult = { simulated: boolean }

/** Re-export path used by portal-booking — keep confirmation in booking-confirm.ts */
export { sendBookingConfirmationEmail } from '@/lib/booking-confirm'

export async function sendBookingReminderEmail(opts: {
  to: string
  clientName: string
  bookingId: string
  practitioner: string
  serviceType: string
  bookingDatetime: Date
  durationMinutes: number
  kind: '24h' | '1h'
  sequence?: number
  siteUrl?: string
}): Promise<CommsResult> {
  const name = practitionerName(opts.practitioner)
  const whenIst = formatWhenIst(opts.bookingDatetime)
  const sessions = sessionsUrl(opts.siteUrl)
  const headline =
    opts.kind === '24h'
      ? 'A quiet reminder for tomorrow'
      : 'Your session begins within the hour'

  const text = [
    `Dear ${opts.clientName},`,
    '',
    headline + '.',
    '',
    `With: ${name}`,
    `When: ${whenIst} (IST)`,
    '',
    opts.kind === '1h'
      ? 'Find a private space. Your join link will appear in Sessions if not already sent.'
      : 'Tomorrow we hold space for you. Rest well tonight.',
    '',
    `Sessions: ${sessions}`,
    '',
    'With care,',
    'AUMVEDA — Archana & Sejal',
  ].join('\n')

  const html = wrapEditorial({
    eyebrow: opts.kind === '24h' ? 'Reminder · 24 hours' : 'Reminder · 1 hour',
    headline,
    greeting: `Dear ${opts.clientName},`,
    bodyHtml: `
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">With</p>
      <p style="margin:0 0 20px;font-size:20px;color:#1C1917;">${escapeHtml(name)}</p>
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">When · IST</p>
      <p style="margin:0 0 20px;font-size:18px;color:#1C1917;">${escapeHtml(whenIst)}</p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#57534E;">
        ${
          opts.kind === '1h'
            ? 'Find a private space. Your join link will appear in Sessions if not already sent.'
            : 'Tomorrow we hold space for you. Rest well tonight.'
        }
      </p>`,
    ctaHref: sessions,
    ctaLabel: 'Open Sessions',
  })

  const ics = buildBookingIcs({
    uid: opts.bookingId,
    title: sessionTitle(opts.serviceType, name),
    description: `Private consultation with ${name}. Sessions: ${sessions}`,
    start: opts.bookingDatetime,
    durationMinutes: opts.durationMinutes,
    attendeeEmail: opts.to,
    attendeeName: opts.clientName,
    sequence: opts.sequence ?? 0,
    method: 'REQUEST',
  })

  const result = await sendEmail({
    to: opts.to,
    subject: `${headline} · ${whenIst}`,
    html,
    text,
    attachments: [
      {
        filename: 'aumveda-session.ics',
        content: ics,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ],
  })
  return { simulated: result.simulated }
}

export async function sendBookingCancelledEmail(opts: {
  to: string
  clientName: string
  bookingId: string
  practitioner: string
  serviceType: string
  bookingDatetime: Date
  durationMinutes: number
  sequence: number
  siteUrl?: string
}): Promise<CommsResult> {
  const name = practitionerName(opts.practitioner)
  const whenIst = formatWhenIst(opts.bookingDatetime)
  const sessions = sessionsUrl(opts.siteUrl)
  const headline = 'Your session has been released'
  const discovery = isDiscovery(opts.serviceType)

  const text = [
    `Dear ${opts.clientName},`,
    '',
    headline + '.',
    '',
    `The ${discovery ? 'Discovery Call' : 'session'} with ${name} on ${whenIst} (IST) is cancelled.`,
    'Your calendar invite is updated to remove this time.',
    '',
    'When you are ready again, book from Sessions.',
    sessions,
    '',
    'With care,',
    'AUMVEDA — Archana & Sejal',
  ].join('\n')

  const html = wrapEditorial({
    eyebrow: 'Cancelled',
    headline,
    greeting: `Dear ${opts.clientName},`,
    bodyHtml: `
      <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#57534E;">
        The ${discovery ? 'Discovery Call' : 'session'} with <strong>${escapeHtml(name)}</strong> on
        <strong>${escapeHtml(whenIst)}</strong> (IST) is released. The attached calendar update removes this time.
      </p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#78716C;">
        When you are ready again, a new beginning waits in Sessions.
      </p>`,
    ctaHref: sessions,
    ctaLabel: 'Open Sessions',
  })

  const ics = buildBookingIcs({
    uid: opts.bookingId,
    title: sessionTitle(opts.serviceType, name),
    description: `Cancelled. Book again: ${sessions}`,
    start: opts.bookingDatetime,
    durationMinutes: opts.durationMinutes,
    attendeeEmail: opts.to,
    attendeeName: opts.clientName,
    sequence: opts.sequence,
    method: 'CANCEL',
    status: 'CANCELLED',
  })

  const result = await sendEmail({
    to: opts.to,
    subject: `${headline} · ${whenIst}`,
    html,
    text,
    attachments: [
      {
        filename: 'aumveda-session-cancelled.ics',
        content: ics,
        contentType: 'text/calendar; charset=utf-8; method=CANCEL',
      },
    ],
  })
  return { simulated: result.simulated }
}

export async function sendBookingRescheduledEmail(opts: {
  to: string
  clientName: string
  bookingId: string
  practitioner: string
  serviceType: string
  previousDatetime: Date
  bookingDatetime: Date
  durationMinutes: number
  sequence: number
  siteUrl?: string
}): Promise<CommsResult> {
  const name = practitionerName(opts.practitioner)
  const whenIst = formatWhenIst(opts.bookingDatetime)
  const prevIst = formatWhenIst(opts.previousDatetime)
  const sessions = sessionsUrl(opts.siteUrl)
  const headline = 'Your session time has moved'

  const text = [
    `Dear ${opts.clientName},`,
    '',
    headline + '.',
    '',
    `Previously: ${prevIst} (IST)`,
    `Now: ${whenIst} (IST)`,
    `With: ${name}`,
    '',
    'Please replace the old calendar entry with the attached invite.',
    sessions,
    '',
    'With care,',
    'AUMVEDA — Archana & Sejal',
  ].join('\n')

  const html = wrapEditorial({
    eyebrow: 'Rescheduled',
    headline,
    greeting: `Dear ${opts.clientName},`,
    bodyHtml: `
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">Previously</p>
      <p style="margin:0 0 16px;font-size:16px;color:#78716C;text-decoration:line-through;">${escapeHtml(prevIst)}</p>
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">Now · IST</p>
      <p style="margin:0 0 20px;font-size:18px;color:#1C1917;">${escapeHtml(whenIst)}</p>
      <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">With</p>
      <p style="margin:0;font-size:20px;color:#1C1917;">${escapeHtml(name)}</p>
      <p style="margin:20px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#78716C;">
        Replace the old calendar entry with the attached invite.
      </p>`,
    ctaHref: sessions,
    ctaLabel: 'Open Sessions',
  })

  const ics = buildBookingIcs({
    uid: opts.bookingId,
    title: sessionTitle(opts.serviceType, name),
    description: `Updated time with ${name}. Sessions: ${sessions}`,
    start: opts.bookingDatetime,
    durationMinutes: opts.durationMinutes,
    attendeeEmail: opts.to,
    attendeeName: opts.clientName,
    sequence: opts.sequence,
    method: 'REQUEST',
    status: 'CONFIRMED',
  })

  const result = await sendEmail({
    to: opts.to,
    subject: `${headline} · ${whenIst}`,
    html,
    text,
    attachments: [
      {
        filename: 'aumveda-session-updated.ics',
        content: ics,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ],
  })
  return { simulated: result.simulated }
}

export async function sendBookingThankYouEmail(opts: {
  to: string
  clientName: string
  bookingId: string
  practitioner: string
  serviceType: string
  bookingDatetime: Date
  siteUrl?: string
}): Promise<CommsResult> {
  const name = practitionerName(opts.practitioner)
  const whenIst = formatWhenIst(opts.bookingDatetime)
  const sessions = sessionsUrl(opts.siteUrl)
  const discovery = isDiscovery(opts.serviceType)
  const headline = discovery
    ? 'Thank you for beginning with us'
    : 'Thank you for the time we shared'

  const text = [
    `Dear ${opts.clientName},`,
    '',
    headline + '.',
    '',
    `It was an honour to sit with you${discovery ? ' on your Discovery Call' : ''} with ${name} (${whenIst} IST).`,
    '',
    'Your sanctuary remains open — journal, daily dose, and Sessions when you are ready for the next step.',
    sessions,
    '',
    'With care,',
    'AUMVEDA — Archana & Sejal',
  ].join('\n')

  const html = wrapEditorial({
    eyebrow: 'Gratitude',
    headline,
    greeting: `Dear ${opts.clientName},`,
    bodyHtml: `
      <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#57534E;">
        It was an honour to sit with you${discovery ? ' on your Discovery Call' : ''} with
        <strong>${escapeHtml(name)}</strong>.
      </p>
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#78716C;">
        Your sanctuary remains open — journal, daily dose, and Sessions when you are ready for the next step.
      </p>`,
    ctaHref: sessions,
    ctaLabel: 'Return to sanctuary',
  })

  const result = await sendEmail({
    to: opts.to,
    subject: `${headline}`,
    html,
    text,
  })
  return { simulated: result.simulated }
}

export async function notifyStaffOfBooking(opts: {
  kind: 'confirmed' | 'cancelled' | 'rescheduled'
  bookingId: string
  practitioner: string
  serviceType: string
  clientName: string
  clientEmail: string
  bookingDatetime: Date
  previousDatetime?: Date
}): Promise<{ practitioner: CommsResult | null; admin: CommsResult | null }> {
  const name = practitionerName(opts.practitioner)
  const whenIst = formatWhenIst(opts.bookingDatetime)
  const label =
    opts.kind === 'confirmed'
      ? 'New booking'
      : opts.kind === 'cancelled'
        ? 'Booking cancelled'
        : 'Booking rescheduled'

  const prevLine = opts.previousDatetime
    ? `\nPreviously: ${formatWhenIst(opts.previousDatetime)} (IST)`
    : ''

  const text = [
    `${label}`,
    '',
    `Booking: ${opts.bookingId}`,
    `Client: ${opts.clientName} <${opts.clientEmail}>`,
    `Practitioner: ${name}`,
    `Service: ${opts.serviceType}`,
    `When: ${whenIst} (IST)${prevLine}`,
  ].join('\n')

  const html = `<pre style="font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap;">${escapeHtml(text)}</pre>`
  const subject = `[AUMVEDA] ${label} · ${opts.clientName} · ${whenIst}`

  let practitioner: CommsResult | null = null
  let admin: CommsResult | null = null

  const pracTo = practitionerNotifyEmail(opts.practitioner)
  if (pracTo) {
    const r = await sendEmail({ to: pracTo, subject, html, text })
    practitioner = { simulated: r.simulated }
  }

  const adminTo = adminNotifyEmail()
  if (adminTo && adminTo !== pracTo) {
    const r = await sendEmail({ to: adminTo, subject, html, text })
    admin = { simulated: r.simulated }
  }

  return { practitioner, admin }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
