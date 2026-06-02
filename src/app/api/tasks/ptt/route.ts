import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import cacheManager from '@/data/cacheManager';
import { updatePttArticles } from '@/task/pttTask';
import { runMergeForMovieBaseIds } from '@/task/mergeTask';
import { authorizeTaskRequest } from '../auth';

export async function POST(request: Request) {
  const unauthorized = authorizeTaskRequest(request);
  if (unauthorized) return unauthorized;

  try {
    // Crawl articles + aggregate counts only for touched movies.
    const pttUpdate = await updatePttArticles(5);
    const mergedMovies = await runMergeForMovieBaseIds(pttUpdate.movieBaseIds);
    await cacheManager.refreshMoviesCache();
    await cacheManager.setRecentMoviesCache();
    revalidatePath('/');
    revalidatePath('/movie/[id]', 'page');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true, articleCount: pttUpdate.articleCount, updatedMovies: pttUpdate.counts.length, mergedCount: mergedMovies.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
