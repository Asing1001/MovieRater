export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Mongo } = await import('./data/db');
    const cacheManager = (await import('./data/cacheManager')).default;
    await Mongo.openDbConnection();
    await cacheManager.init();
    // Best-effort post-boot refresh; the hourly scheduler is the source of truth.
    (async () => {
      const { updateLineSchedules } = await import('./task/lineScheduleTask');
      await updateLineSchedules();
      await cacheManager.setMoviesSchedulesCache();
      await cacheManager.setTheatersCache();
    })().catch(console.error);
  }
}
