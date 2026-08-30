import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that should remain accessible during waitlist mode
const ALLOWED = [
  '/waitlist',
  '/api/waitlist',
  '/api/unsubscribe',
  '/unsubscribe',
];

// Set WAITLIST_MODE=off (see .env) to open the full site — used for local review
// of the storefront while the public build stays gated.
const GATE_ENABLED = process.env.WAITLIST_MODE !== 'off';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!GATE_ENABLED) return NextResponse.next();

  // Allow static assets, Next.js internals, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/waitlist-bg') ||
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Allow waitlist page and its API
  if (ALLOWED.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Everything else → waitlist
  return NextResponse.redirect(new URL('/waitlist', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
