import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getNewImdbInfos, updateNewImdbInfos } from '@/task/imdbTask';
import cacheManager from '@/data/cacheManager';
import Movie from '@/models/movie';

export async function POST() {
  try {
    const movieInfos = await getNewImdbInfos();
    await updateNewImdbInfos(movieInfos);

    // Patch in-memory cache immediately so ratings show without waiting for daily merge
    const patchMap: Record<string, Movie> = {};
    for (const info of movieInfos) {
      if (info.movieBaseId && info.imdbID) patchMap[info.movieBaseId] = info;
    }
    const applyPatch = (movies: Movie[]) =>
      movies.map((m) => patchMap[m.movieBaseId] ? { ...m, ...patchMap[m.movieBaseId] } : m);

    const patched = applyPatch(cacheManager.get(cacheManager.All_MOVIES) ?? []);
    cacheManager.set(cacheManager.All_MOVIES, patched);
    cacheManager.setMovieLookupCache(patched);

    const patchedRecent = applyPatch(cacheManager.get(cacheManager.RECENT_MOVIES) ?? []);
    cacheManager.set(cacheManager.RECENT_MOVIES, patchedRecent);

    const found = movieInfos.filter((m) => m.imdbID).length;
    const notFound = movieInfos.length - found;
    // Bust ISR cache so movie pages show updated IMDB ratings immediately
    revalidatePath('/movie/[id]', 'page');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true, found, notFound });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
