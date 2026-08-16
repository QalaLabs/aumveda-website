import { createHash, createHmac } from 'crypto'

const REGION = 'auto'

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data).digest()
}

function sha256Hex(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

function getSignatureKey(key: string, dateStamp: string): Buffer {
  const kDate = hmac(`AWS4${key}`, dateStamp)
  const kRegion = hmac(kDate, REGION)
  const kService = hmac(kRegion, 's3')
  return hmac(kService, 'aws4_request')
}

/** True when every Cloudflare R2 credential is present. */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET_NAME,
  )
}

/** Public URL for an R2 object key. */
export function r2PublicUrl(key: string): string {
  const base =
    process.env.CLOUDFLARE_R2_PUBLIC_URL ||
    `https://${process.env.CLOUDFLARE_R2_BUCKET_NAME}.r2.cloudflarestorage.com`
  return `${base.replace(/\/+$/, '')}/${key.split('/').map(encodeURIComponent).join('/')}`
}

/**
 * S3-compatible SigV4 presigned PUT URL for Cloudflare R2 (unsigned payload).
 * The request must include the signed headers (host, x-amz-*); Content-Type
 * may be set freely since it is not part of the signature.
 */
export function createPresignedPutUrl(
  key: string,
  expiresSec = 3600,
): string {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!
  const secretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!

  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const scope = `${dateStamp}/${REGION}/s3/aws4_request`

  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders =
    `host:${host}\n` +
    'x-amz-content-sha256:UNSIGNED-PAYLOAD\n' +
    `x-amz-date:${amzDate}\n`

  const canonicalRequest = [
    'PUT',
    `/${key}`,
    '',
    canonicalHeaders,
    signedHeaders,
    'UNSIGNED-PAYLOAD',
  ].join('\n')

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join('\n')

  const signature = hmac(getSignatureKey(secretKey, dateStamp), stringToSign).toString('hex')

  const query = [
    'X-Amz-Algorithm=AWS4-HMAC-SHA256',
    `X-Amz-Credential=${encodeURIComponent(`${accessKeyId}/${scope}`)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expiresSec}`,
    `X-Amz-SignedHeaders=${encodeURIComponent(signedHeaders)}`,
    `X-Amz-Signature=${signature}`,
  ].join('&')

  return `https://${host}/${key}?${query}`
}
