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

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  if (!transporter) {
    console.log('\n┌────────────────────────────────────────────────────────┐')
    console.log(`│ [SMTP SIMULATOR] Email sent to: ${to.padEnd(25)} │`)
    console.log(`│ Subject: ${subject.padEnd(46)} │`)
    console.log('├────────────────────────────────────────────────────────┤')
    console.log(text || html)
    console.log('└────────────────────────────────────────────────────────┘\n')
    return
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    })
  } catch (error) {
    console.error(`FAILED TO SEND EMAIL to ${to}:`, error)
    throw error
  }
}
