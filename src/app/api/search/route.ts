import { NextRequest, NextResponse } from 'next/server';
import { getAllMovieNames } from '@/lib/movies';

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q) return NextResponse.json([]);

  const lower = q.toLowerCase();
  const results = getAllMovieNames()
    .filter(({ text }) => text.toLowerCase().includes(lower))
    .slice(0, 10);

  return NextResponse.json(results);
}
