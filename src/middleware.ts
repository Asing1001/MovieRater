import { NextResponse, type NextRequest } from 'next/server';

// Cloudflare Free/Pro only honors `Accept-Encoding` in `Vary` and treats
// responses with extra variants (Next.js's rsc + next-router-* entries)
// as uncacheable (cf-cache-status: DYNAMIC). We explicitly collapse Vary
// here so Cloudflare can cache HTML; RSC client-navigation requests are
// routed to a separate cache entry by a Cloudflare Cache Rule that
// bypasses cache when the `rsc` request header is present, so we never
// serve HTML to an RSC client or vice versa.
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Vary', 'Accept-Encoding');
  return response;
}

export const config = {
  matcher: [
    // Apply to all pages except Next.js internals and static assets.
    '/((?!_next/|api/|favicons/|image/|ads.txt|robots.txt|sitemap.xml).*)',
  ],
};
