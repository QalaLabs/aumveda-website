import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Mock successful upload to Cloudflare R2
    const fileType = file.type
    const randomId = Math.random().toString(36).substring(7)
    const fileName = `${randomId}_${file.name.replace(/\s+/g, '_')}`

    let mockUrl = ''
    if (fileType.startsWith('audio/')) {
      mockUrl = `https://r2.aumveda.com/voice-notes/${fileName}`
    } else {
      mockUrl = `https://r2.aumveda.com/attachments/${fileName}`
    }

    return NextResponse.json({ success: true, url: mockUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
