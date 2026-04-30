import { NextResponse } from 'next/server';
import { Mongo } from '@/data/db';
import { runMerge } from '@/task/mergeTask';
import cacheManager from '@/data/cacheManager';
import { updatePttArticles } from '@/task/pttTask';

export async function POST() {
  try {
    // 1. Merge yahooMovies + pttArticles → mergedDatas so new LINE movies are included
    await runMerge();
    // 2. Refresh only the movies cache so findMovieBaseId picks up the fresh movie list
    await cacheManager.refreshMoviesCache();
    // 3. Jump crawl index to near current PTT max so next runs pick up recent articles
    await Mongo.updateDocument(
      { name: 'crawlerStatus' },
      { lastCrawlPttIndex: 10900 },
      'configs'
    );
    // 4. Crawl PTT articles — findMovieBaseId now sees the freshly merged movies
    await updatePttArticles(5);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
