import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/** Must match {@link AUTH_SESSION_COOKIE} in `@/lib/auth-session-cookie`. */
const AUTH_SESSION_COOKIE_NAME = 'twox_auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Runs before App Router (incl. client navigations). Fixes /settings 404 on some Vercel deploys.
  if (pathname === '/settings' || pathname === '/settings/') {
    const url = request.nextUrl.clone()
    url.pathname = '/settings/general'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/profile')) {
    const ok = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value === '1'
    if (!ok) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
