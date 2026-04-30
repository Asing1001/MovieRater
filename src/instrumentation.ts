export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Mongo } = await import('./data/db');
    const cacheManager = (await import('./data/cacheManager')).default;
    const { initScheduler } = await import('./backgroundService/scheduler');
    await Mongo.openDbConnection();
    // Init cache in background — don't block server startup
    cacheManager.init().catch(console.error);
    initScheduler();
  }
}
