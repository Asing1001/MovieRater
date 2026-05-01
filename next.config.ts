import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'movie.tw.line.me' },
      { protocol: 'https', hostname: 'obs.line-scdn.net' },
      { protocol: 'https', hostname: 'vod-progressive.akamaized.net' },
    ],
  },
  async headers() {
    // Cache strategy: browsers don't cache (max-age=0), Cloudflare/CDN caches per s-maxage,
    // and serves a stale response up to stale-while-revalidate seconds while it refreshes
    // in the background. swr is the key knob that makes Cloud Run cold starts invisible:
    // even when origin takes 5s to wake up, the edge serves stale instantly.
    // Vary normalization happens in a Cloudflare Worker (cloudflare/worker.js)
    // because next.config.ts headers and middleware can't override the
    // framework-set Vary in App Router — confirmed Next.js limitation:
    // https://github.com/vercel/next.js/discussions/82571
    const oneHour = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';
    const tenMin = 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';
    const fiveMin = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';
    const oneDay = 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800';
    return [
      // Homepage / "now playing" — refreshed hourly by LINE task; short s-maxage so new
      // movies appear within ~10 min of a crawl, swr keeps cold starts invisible.
      { source: '/', headers: [{ key: 'Cache-Control', value: tenMin }] },
      // Upcoming list — barely changes between releases.
      { source: '/upcoming', headers: [{ key: 'Cache-Control', value: oneHour }] },
      // Detail pages — ISR-backed, refreshed by LINE/IMDB/PTT tasks.
      { source: '/movie/:id', headers: [{ key: 'Cache-Control', value: oneHour }] },
      { source: '/theater/:name', headers: [{ key: 'Cache-Control', value: oneHour }] },
      // List pages — match the hourly LINE schedule cadence.
      { source: '/theaters', headers: [{ key: 'Cache-Control', value: oneHour }] },
      { source: '/sitemap.xml', headers: [{ key: 'Cache-Control', value: oneHour }] },
      // Search — ?q= is unbounded; only repeat queries within 5 min hit cache.
      { source: '/search', headers: [{ key: 'Cache-Control', value: fiveMin }] },
      // robots.txt effectively never changes.
      { source: '/robots.txt', headers: [{ key: 'Cache-Control', value: oneDay }] },
      // API routes must never be cached (auth headers, POST, side effects).
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

export default nextConfig;
