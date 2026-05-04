import type { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/data/collections';
import { Mongo } from '@/data/db';
import Movie from '@/models/movie';
import Theater from '@/models/theater';

// Render at request time so the Docker build (no DB) doesn't try to prerender.
// Cloudflare/CDN edge caching is achieved via the Cache-Control header below.
export const dynamic = 'force-dynamic';

const ROOT = 'https://www.mvrater.com';

function parseDate(s: unknown): Date | undefined {
  if (typeof s !== 'string' || !s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await Mongo.openDbConnection();
  const [movies, theaters] = await Promise.all([
    Mongo.db
      .collection<Movie>(COLLECTIONS.mergedDatas)
      .find({ chineseTitle: { $exists: true, $ne: '' } })
      .project({ movieBaseId: 1, imdbLastCrawlTime: 1 })
      .toArray(),
    Mongo.db
      .collection<Theater>(COLLECTIONS.theaters)
      .find({ lineTheaterId: { $exists: true, $ne: null } })
      .project({ name: 1 })
      .toArray(),
  ]);

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${ROOT}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${ROOT}/theaters`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${ROOT}/upcoming`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];
  const theaterEntries: MetadataRoute.Sitemap = theaters.map((t) => ({
    url: `${ROOT}/theater/${encodeURIComponent(t.name)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.6,
  }));
  const movieEntries: MetadataRoute.Sitemap = movies
    .filter((m) => m.movieBaseId || m._id)
    .map((m) => ({
      url: `${ROOT}/movie/${m.movieBaseId ?? String(m._id)}`,
      lastModified: parseDate(m.imdbLastCrawlTime) ?? now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticEntries, ...theaterEntries, ...movieEntries];
}
