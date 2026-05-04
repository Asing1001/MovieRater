import { Mongo } from '@/data/db';
import { COLLECTIONS } from '@/data/collections';
import Theater from '@/models/theater';
import TheaterList from '@/components/TheaterList';
import { serialize } from '@/lib/utils';
import { buildMetadata, itemListJsonLd, jsonLd, theaterPath } from '@/lib/seo';
import type { Metadata } from 'next';

// Dynamic so the static prerender at Docker build time (no DB access) doesn't
// bake in an empty list. CDN caching is handled via Cache-Control in next.config.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = buildMetadata({
  title: '電影院 - Movie Rater',
  description: '依地區整理台灣電影院與即時電影場次，快速查詢各影城地址、電話與上映時刻。',
  path: '/theaters',
});

export default async function TheatersPage() {
  const all = await Mongo.getCollection<Theater>({ name: COLLECTIONS.theaters, sort: { regionIndex: 1 } });
  const theaters = serialize(all.filter((t) => t.lineTheaterId));
  const schema = itemListJsonLd(
    theaters.map((theater) => ({
      name: theater.name,
      url: theaterPath(theater.name),
    })),
    '台灣電影院列表',
    'MovieTheater'
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <TheaterList theaters={theaters} />
    </>
  );
}
