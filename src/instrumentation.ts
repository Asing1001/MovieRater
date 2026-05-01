export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Mongo } = await import('./data/db');
    const cacheManager = (await import('./data/cacheManager')).default;
    await Mongo.openDbConnection();
    cacheManager.init().then(async () => {
      const { updateLineSchedules } = await import('./task/lineScheduleTask');
      await updateLineSchedules();
      await cacheManager.setMoviesSchedulesCache();
      await cacheManager.setTheatersCache();
    }).catch(console.error);
  }
}
