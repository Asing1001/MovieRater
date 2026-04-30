import { Mongo } from '@/data/db';
import Theater from '@/models/theater';
import TheaterList from '@/components/TheaterList';
import { serialize } from '@/lib/utils';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const metadata: Metadata = { title: '電影院 - Movie Rater' };

export default async function TheatersPage() {
  const all = await Mongo.getCollection<Theater>({ name: 'theaters', sort: { regionIndex: 1 } });
  const theaters = serialize(all.filter((t) => t.lineTheaterId));
  return <TheaterList theaters={theaters} />;
}
