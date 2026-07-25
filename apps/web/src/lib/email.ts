import nodemailer from 'nodemailer'

const host = process.env.EMAIL_SERVER_HOST
const port = Number(process.env.EMAIL_SERVER_PORT || 587)
const user = process.env.EMAIL_SERVER_USER
const pass = process.env.EMAIL_SERVER_PASSWORD
const from = process.env.EMAIL_FROM || 'noreply@aumveda.com'

const transporter = host && user
  ? nodemailer.createTransport({
      host,
      port,
      auth: { user, pass },
    })
  : null

export type EmailAttachment = {
  filename: string
  content: string | Buffer
  contentType?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
}): Promise<{ ok: true; simulated: boolean }> {
  if (!transporter) {
    console.log('\n┌────────────────────────────────────────────────────────┐')
    console.log(`│ [SMTP SIMULATOR] Email sent to: ${to.padEnd(25)} │`)
    console.log(`│ Subject: ${subject.padEnd(46)} │`)
    if (attachments?.length) {
      console.log(`│ Attachments: ${attachments.map((a) => a.filename).join(', ')}`)
    }
    console.log('├────────────────────────────────────────────────────────┤')
    console.log(text || html)
    console.log('└────────────────────────────────────────────────────────┘\n')
    return { ok: true, simulated: true }
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    })
    return { ok: true, simulated: false }
  } catch (error) {
    console.error(`FAILED TO SEND EMAIL to ${to}:`, error)
    throw error
  }
}
