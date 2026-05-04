import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Mongo } from '@/data/db';
import { COLLECTIONS } from '@/data/collections';
import cacheManager from '@/data/cacheManager';
import { updatePttArticles } from '@/task/pttTask';
import Movie from '@/models/movie';

export async function POST() {
  try {
    // Ensure All_MOVIES cache is warm so findMovieBaseId can match article titles
    if ((cacheManager.get(cacheManager.All_MOVIES) ?? []).length === 0) {
      await cacheManager.refreshMoviesCache();
    }
    // Jump crawl index to near current PTT max so next runs pick up recent articles
    await Mongo.updateDocument(
      { name: 'crawlerStatus' },
      { lastCrawlPttIndex: 10900 },
      COLLECTIONS.configs
    );
    // Crawl articles + aggregate counts + persist to movieBases/mergedDatas
    const pttCounts = await updatePttArticles(5);
    // Patch in-memory caches immediately (same pattern as imdbTask)
    const patchMap: Record<string, object> = {};
    for (const c of pttCounts) {
      patchMap[c._id] = { pttGoodCount: c.pttGoodCount, pttNormalCount: c.pttNormalCount, pttBadCount: c.pttBadCount };
    }
    const apply = (arr: Movie[]) => arr.map((m) => m.movieBaseId && patchMap[m.movieBaseId] ? { ...m, ...patchMap[m.movieBaseId] } : m);
    cacheManager.set(cacheManager.All_MOVIES, apply(cacheManager.get(cacheManager.All_MOVIES) ?? []));
    cacheManager.set(cacheManager.RECENT_MOVIES, apply(cacheManager.get(cacheManager.RECENT_MOVIES) ?? []));
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true, updatedMovies: pttCounts.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
