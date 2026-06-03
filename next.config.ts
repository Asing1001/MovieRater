import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'movie.tw.line.me' },
      { protocol: 'https', hostname: 'obs.line-scdn.net' },
      { protocol: 'https', hostname: 'vod-progressive.akamaized.net' },
    ],
  },
  async headers() {
    // Browser cache stays disabled; Cloudflare caches HTML by s-maxage after
    // cloudflare/vary-fix-worker.js normalizes App Router Vary headers.
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
      // robots.txt and llms.txt effectively never change.
      { source: '/robots.txt', headers: [{ key: 'Cache-Control', value: oneDay }] },
      { source: '/llms.txt', headers: [{ key: 'Cache-Control', value: oneDay }] },
      // API routes must never be cached (auth headers, POST, side effects).
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

export default nextConfig;
