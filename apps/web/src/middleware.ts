import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Get NextAuth token to decode session information
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 2. Define route scopes
  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/learn')

  const isPractitionerRoute = pathname.startsWith('/practitioner')
  const isAdminRoute = pathname.startsWith('/admin')

  // 3. RBAC validation
  if (isDashboardRoute || isPractitionerRoute || isAdminRoute) {
    // Local preview: skip auth gate when DEV_BYPASS=true (pages use requireSession mock)
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.DEV_BYPASS === 'true' &&
      isDashboardRoute
    ) {
      return NextResponse.next()
    }

    if (!token) {
      // Not logged in -> redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const role = token.role || 'client'

    // Admin Route Protection: Admin & Super Admin only
    if (isAdminRoute && role !== 'admin' && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url))
    }

    // Practitioner Route Protection: Practitioner, Admin, & Super Admin only
    if (
      isPractitionerRoute &&
      role !== 'practitioner' &&
      role !== 'admin' &&
      role !== 'super_admin'
    ) {
      return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url))
    }

    // Client Route Protection: client/user (schema default), Admin, & Super Admin
    if (
      isDashboardRoute &&
      role !== 'client' &&
      role !== 'admin' &&
      role !== 'super_admin'
    ) {
      // Practitioner attempting to visit client dashboard -> redirect to practitioner portal
      if (role === 'practitioner') {
        return NextResponse.redirect(new URL('/practitioner', request.url))
      }
      return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', request.url))
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
    '/admin/:path*',
  ],
}
