import { NextRequest, NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { isR2Configured, createPresignedPutUrl, r2PublicUrl } from '@/lib/r2'

export const dynamic = 'force-dynamic'

const MAX_FILE_BYTES = 25 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await getApiSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'File exceeds the 25MB upload limit' },
        { status: 413 },
      )
    }

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: 'Upload storage is not configured' },
        { status: 503 },
      )
    }

    const type = file.type || 'application/octet-stream'
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)
    const key = `attachments/${session.user.id}/${Date.now()}_${safeName}`

    const signedUrl = createPresignedPutUrl(key)
    const bytes = Buffer.from(await file.arrayBuffer())

    const putRes = await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': type },
      body: bytes,
    })

    if (!putRes.ok) {
      return NextResponse.json(
        { error: 'Upload to storage failed' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true, url: r2PublicUrl(key) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
