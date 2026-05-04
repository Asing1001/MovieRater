/**
 * Cloudflare Worker for www.mvrater.com HTML caching.
 *
 * Next App Router HTML responses include RSC-specific Vary values that make
 * Cloudflare skip cache. For normal HTML GETs, this Worker caches the response
 * after normalizing Vary to Accept-Encoding.
 *
 * Bypass rules:
 * - /api/* and non-GET requests go to origin.
 * - RSC requests (`rsc: 1`) go to origin and are never cached.
 * - Cache TTL comes from origin Cache-Control in next.config.ts.
 * - Verify with GET, not HEAD:
 *   `curl -s -D - -o /dev/null https://www.mvrater.com/`
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Pass through API routes (own auth, no-store) and non-GET (POST tasks).
    if (url.pathname.startsWith('/api/') || request.method !== 'GET') {
      return fetch(request);
    }

    // RSC client-side navigation: don't cache, never serve from cache —
    // RSC payloads are different from HTML and should always be fresh.
    if (request.headers.get('rsc') === '1') {
      return fetch(request);
    }

    const cache = caches.default;

    // Try edge cache first.
    let response = await cache.match(request);
    if (response) {
      // Add a hint header so we can tell from curl that it came from our cache.
      const r = new Response(response.body, response);
      r.headers.set('x-vary-fix', 'hit');
      return r;
    }

    // Cache miss — fetch origin.
    response = await fetch(request);

    // Only cache successful, cacheable responses.
    if (response.status !== 200) return response;

    const cc = response.headers.get('cache-control') || '';
    if (cc.includes('no-store') || cc.includes('private')) return response;

    // Build a cacheable copy with normalized Vary.
    const fixed = new Response(response.body, response);
    fixed.headers.set('Vary', 'Accept-Encoding');
    fixed.headers.set('x-vary-fix', 'miss');

    ctx.waitUntil(cache.put(request, fixed.clone()));
    return fixed;
  },
};
