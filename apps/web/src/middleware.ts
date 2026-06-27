import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PROTECTED = ['/dashboard', '/onboarding', '/learn', '/checkout']
const ADMIN_PROTECTED = ['/practitioner']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAuth = AUTH_PROTECTED.some(p => pathname.startsWith(p))
  const needsAdmin = ADMIN_PROTECTED.some(p => pathname.startsWith(p))

  if (needsAdmin || needsAuth) {
    const token =
      request.cookies.get('next-auth.session-token')?.value ??
      request.cookies.get('__Secure-next-auth.session-token')?.value

    if (!token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/learn/:path*',
    '/checkout/:path*',
    '/practitioner/:path*',
  ],
}
