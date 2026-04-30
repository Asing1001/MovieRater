import { Mongo } from '@/data/db';
import Theater from '@/models/theater';
import TheaterList from '@/components/TheaterList';
import { serialize } from '@/lib/utils';
import type { Metadata } from 'next';

// Dynamic so the static prerender at Docker build time (no DB access) doesn't
// bake in an empty list. CDN caching is handled via Cache-Control in next.config.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '電影院 - Movie Rater' };

export default async function TheatersPage() {
  const all = await Mongo.getCollection<Theater>({ name: 'theaters', sort: { regionIndex: 1 } });
  const theaters = serialize(all.filter((t) => t.lineTheaterId));
  return <TheaterList theaters={theaters} />;
}
