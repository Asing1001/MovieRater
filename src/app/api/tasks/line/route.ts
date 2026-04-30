import { NextResponse } from 'next/server';
import { updateLINEMovies } from '@/task/lineTask';
import cacheManager from '@/data/cacheManager';
import { updateLineSchedules } from '@/task/lineScheduleTask';

export async function POST() {
  try {
    await updateLINEMovies();
    await cacheManager.setRecentMoviesCache();
    await updateLineSchedules();
    await cacheManager.setMoviesSchedulesCache();
    const count = (cacheManager.get(cacheManager.MOVIES_SCHEDULES) ?? []).length;
    return NextResponse.json({ ok: true, scheduleCount: count });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
