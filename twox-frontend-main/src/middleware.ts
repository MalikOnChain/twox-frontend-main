import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  // Allow all routes so pages remain directly accessible.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
