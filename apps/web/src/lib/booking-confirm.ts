import { sendEmail } from '@/lib/email'
import { buildBookingIcs } from '@/lib/ics'

const PRACTITIONER_LABEL: Record<string, string> = {
  sejal: 'Sejal Jain',
  archana: 'Archana Jain',
}

export async function sendBookingConfirmationEmail(opts: {
  to: string
  clientName: string
  bookingId: string
  practitioner: string
  serviceType: string
  bookingDatetime: Date
  durationMinutes: number
  siteUrl?: string
}): Promise<{ simulated: boolean }> {
  const practitionerName = PRACTITIONER_LABEL[opts.practitioner] || opts.practitioner
  const whenIst = opts.bookingDatetime.toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  })
  const site = opts.siteUrl || process.env.NEXTAUTH_URL || 'https://aumveda.com'
  const confirmUrl = `${site.replace(/\/$/, '')}/dashboard/appointments/confirmed?bookingId=${opts.bookingId}`
  const sessionsUrl = `${site.replace(/\/$/, '')}/dashboard/appointments`
  const isDiscovery = opts.serviceType === 'discovery_call' || opts.serviceType.toLowerCase().includes('discovery')

  const title = isDiscovery
    ? 'Your Discovery Call is reserved'
    : 'Your session is reserved'

  const text = [
    `Dear ${opts.clientName},`,
    '',
    title + '.',
    '',
    `With: ${practitionerName}`,
    `When: ${whenIst} (IST)`,
    `Duration: ${opts.durationMinutes} minutes`,
    '',
    'What happens next:',
    '1. Add the attached calendar invite to your diary.',
    '2. We will email a join link closer to the hour.',
    '3. Find a quiet private space; your portal profile already informs the call.',
    '',
    'Reschedule or cancel: reply to this email or visit your Sessions page at least 24 hours before.',
    sessionsUrl,
    '',
    'View confirmation:',
    confirmUrl,
    '',
    'With care,',
    'AUMVEDA — Archana & Sejal',
  ].join('\n')

  const html = `<!DOCTYPE html>
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
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#A67C2D;">Confirmed</p>
          <h1 style="margin:0 0 20px;font-size:28px;font-weight:400;line-height:1.25;color:#1C1917;">${escapeHtml(title)}</h1>
          <p style="margin:0 0 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.6;color:#57534E;">Dear ${escapeHtml(opts.clientName)},</p>
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">With</p>
          <p style="margin:0 0 20px;font-size:20px;color:#1C1917;">${escapeHtml(practitionerName)}</p>
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#78716C;">When · IST</p>
          <p style="margin:0 0 28px;font-size:18px;color:#1C1917;">${escapeHtml(whenIst)}</p>
          <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#A67C2D;">What happens next</p>
          <ol style="margin:0 0 28px;padding-left:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#57534E;">
            <li>Add the calendar invite attached to this email.</li>
            <li>We send a join link closer to the hour.</li>
            <li>Arrive in a quiet private space — your profile already informs the call.</li>
          </ol>
          <p style="margin:0 0 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.6;color:#78716C;">
            Reschedule or cancel at least 24 hours before via your Sessions page or by replying to this email. Confidential. India-hosted.
          </p>
          <p style="margin:0;text-align:center;">
            <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:14px 28px;background:#1C1917;color:#E8D5A3;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;border-radius:999px;">View confirmation</a>
          </p>
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#A8A29E;">With care — Archana &amp; Sejal</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const ics = buildBookingIcs({
    uid: opts.bookingId,
    title: isDiscovery
      ? `AUMVEDA Discovery Call with ${practitionerName}`
      : `AUMVEDA session with ${practitionerName}`,
    description: `Private consultation with ${practitionerName}. Reschedule: ${sessionsUrl}`,
    start: opts.bookingDatetime,
    durationMinutes: opts.durationMinutes,
    attendeeEmail: opts.to,
    attendeeName: opts.clientName,
  })

  const result = await sendEmail({
    to: opts.to,
    subject: `${title} · ${whenIst}`,
    html,
    text,
    attachments: [
      {
        filename: 'aumveda-discovery-call.ics',
        content: ics,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      },
    ],
  })
  return { simulated: result.simulated }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
