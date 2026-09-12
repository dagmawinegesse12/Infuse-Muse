import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that should remain accessible during waitlist mode
const ALLOWED = [
  '/waitlist',
  '/api/waitlist',
  '/api/unsubscribe',
  '/unsubscribe',
];

/*
  Retired once the shop opens: the launch these people signed up for has
  happened, so the page sends them to the shop instead.

  Only the page. Three neighbours stay up on purpose:
  - /api/waitlist still backs "The Correspondence", the mailing-list field on
    the homepage, which outlives the launch.
  - /api/unsubscribe and /unsubscribe are linked from every confirmation email
    already sent, and must work for as long as those sit in people's inboxes.
*/
const RETIRED = ['/waitlist'];

// Set WAITLIST_MODE=off (see .env) to open the full site — used for local review
// of the storefront while the public build stays gated.
const GATE_ENABLED = process.env.WAITLIST_MODE !== 'off';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
    Both halves of this hang off the one flag, and that is load-bearing: while
    the gate is up every other path redirects TO /waitlist, so retiring it at
    the same time would put the site in a redirect loop between the two.
  */
  if (!GATE_ENABLED) {
    if (RETIRED.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

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
