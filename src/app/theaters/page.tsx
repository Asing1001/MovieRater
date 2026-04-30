import { getTheaters } from '@/lib/theaters';
import TheaterList from '@/components/TheaterList';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '電影院 - Movie Rater' };

export default function TheatersPage() {
  const theaters = getTheaters();
  return <TheaterList theaters={theaters} />;
}
