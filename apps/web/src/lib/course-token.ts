import { createHmac, timingSafeEqual } from 'crypto'

const SEP = '.'

function b64url(data: string): string {
  return Buffer.from(data, 'utf8').toString('base64url')
}

/**
 * Compact HMAC-signed token (payload.signature), self-contained and
 * verifiable without extra deps. Signed with COURSE_JWT_SECRET.
 */
export function signCourseToken(
  payload: Record<string, unknown>,
  ttlSec = 3600,
): string {
  const secret = process.env.COURSE_JWT_SECRET || ''
  const now = Math.floor(Date.now() / 1000)
  const body = JSON.stringify({ ...payload, iat: now, exp: now + ttlSec })
  const data = b64url(body)
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}${SEP}${sig}`
}

export function verifyCourseToken(token: string): Record<string, unknown> | null {
  try {
    const idx = token.lastIndexOf(SEP)
    if (idx <= 0) return null
    const data = token.slice(0, idx)
    const sig = token.slice(idx + 1)
    if (!data || !sig) return null

    const secret = process.env.COURSE_JWT_SECRET || ''
    const expected = createHmac('sha256', secret).update(data).digest('base64url')
    const expectedBuf = Buffer.from(expected)
    const sigBuf = Buffer.from(sig)
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as {
      exp?: number
    } & Record<string, unknown>
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}
