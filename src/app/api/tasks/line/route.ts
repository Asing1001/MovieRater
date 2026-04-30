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
    // Bust ISR cache so /theaters and individual theater pages show fresh data immediately
    revalidatePath('/theaters');
    revalidatePath('/theater/[name]', 'page');
    return NextResponse.json({ ok: true, scheduleCount: count });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
