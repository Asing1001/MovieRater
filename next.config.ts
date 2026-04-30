import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'movie.tw.line.me' },
      { protocol: 'https', hostname: 'vod-progressive.akamaized.net' },
    ],
  },
};

export default nextConfig;
