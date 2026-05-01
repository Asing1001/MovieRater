/**
 * Cloudflare Worker: vary-fix
 *
 * Sits between Cloudflare's edge and Cloud Run (the Next.js origin) to
 * normalize the response Vary header so Cloudflare's Free-tier cache will
 * actually cache HTML responses.
 *
 * Why this exists:
 *   Next.js 15 App Router emits `Vary: rsc, next-router-state-tree,
 *   next-router-prefetch, next-router-segment-prefetch, Accept-Encoding`.
 *   Cloudflare Free/Pro only honors `Accept-Encoding` in Vary; with extra
 *   variants present it marks the response cf-cache-status: DYNAMIC and
 *   refuses to cache. There is no way (as of Next.js 15.5) to override
 *   this from middleware or next.config.ts — the framework re-sets the
 *   header after both. Confirmed by Next.js discussions #82571 and #66471.
 *   Cloudflare's own docs recommend a Worker for this exact scenario.
 *
 * What this Worker does:
 *   1. /api/* and non-GET requests pass straight through to origin (no caching).
 *   2. RSC navigation requests (those with `rsc: 1` request header from
 *      Next.js client-side routing) bypass cache so they get a fresh RSC
 *      payload and don't pollute the HTML cache.
 *   3. Everything else: try Cloudflare's edge cache. On miss, fetch origin,
 *      strip the offending Vary entries (set to just Accept-Encoding), and
 *      explicitly put the modified response into the cache via cache.put().
 *      Origin's Cache-Control (s-maxage / stale-while-revalidate) controls
 *      TTL — the Worker just normalizes Vary so CF stops bailing out.
 *
 * Deployment (Cloudflare dashboard):
 *   1. Workers & Pages → Create application → Create Worker → name it
 *      "mvrater-vary-fix".
 *   2. Replace the template with the contents of this file → Deploy.
 *   3. Open the Worker → Settings → Triggers → Add a Custom Domain
 *      `www.mvrater.com` (preferred — it bypasses CF's normal proxy path
 *      and the Worker becomes the front door). Or add a Route
 *      `www.mvrater.com/*` if you want the Worker only for that hostname.
 *   4. Disable the existing Cache Rule "Honor origin Cache-Control" — the
 *      Worker now owns caching. Keep "Bypass cache for RSC navigation" off
 *      too; the Worker handles RSC bypass itself.
 *   5. Verify: `curl -sI https://www.mvrater.com/` should show
 *      `vary: Accept-Encoding` and second hit `cf-cache-status: HIT`.
 *
 * Free-tier budget:
 *   100,000 Worker requests/day. This site is well under that — the Worker
 *   only runs for cache misses + RSC requests; HTML cache hits are served
 *   directly from Cloudflare's edge cache without invoking the Worker.
 *   Actually: with Custom Domain triggers ALL requests run the Worker once,
 *   but it returns from cache.match() in a few ms.
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
