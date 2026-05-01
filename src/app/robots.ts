import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/bbs/movie', '/artist_filmography.html'],
      },
    ],
    sitemap: 'https://www.mvrater.com/sitemap.xml',
    host: 'https://www.mvrater.com',
  };
}
