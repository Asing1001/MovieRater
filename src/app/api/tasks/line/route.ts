import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateLINEMovies } from '@/task/lineTask';
import cacheManager from '@/data/cacheManager';
import { updateLineSchedules } from '@/task/lineScheduleTask';

export async function POST() {
  try {
    await updateLINEMovies();
    await cacheManager.setRecentMoviesCache();
    await updateLineSchedules();
    await cacheManager.setMoviesSchedulesCache();
    await cacheManager.setTheatersCache();
    const count = (cacheManager.get(cacheManager.MOVIES_SCHEDULES) ?? []).length;
    // Bust ISR cache so individual theater pages show fresh data immediately.
    // /theaters itself is force-dynamic; CDN edge cache is handled via Cache-Control.
    revalidatePath('/theater/[name]', 'page');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ ok: true, scheduleCount: count });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
