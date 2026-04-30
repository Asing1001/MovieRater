export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Mongo } = await import('./data/db');
    const cacheManager = (await import('./data/cacheManager')).default;
    const { initScheduler } = await import('./backgroundService/scheduler');
    await Mongo.openDbConnection();
    // Init cache then crawl LINE schedules — all in background
    cacheManager.init().then(async () => {
      const { updateLineSchedules } = await import('./task/lineScheduleTask');
      await updateLineSchedules();
      await cacheManager.setMoviesSchedulesCache();
    }).catch(console.error);
    initScheduler();
  }
}
