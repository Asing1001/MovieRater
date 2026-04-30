import * as cron from 'node-cron';
import { systemSetting, schedulerSetting } from '../configs/systemSetting';
import { updateTheaterWithLocationList } from '../task/yahooTask';
import { updatePttArticles } from '../task/pttTask';
import { updateImdbInfo } from '../task/imdbTask';
import cacheManager from '../data/cacheManager';
import { updateMoviesSchedules } from '../task/atmoviesTask';
import { updateLINEMovies } from '../task/lineTask';

export function initScheduler() {
  if (!systemSetting.enableScheduler) {
    return;
  }
  console.log('[Scheduler] init');

  cron.schedule('10 * * * *', async () => {
    console.time('[Scheduler] updateLINEMovies');
    await updateLINEMovies();
    console.timeEnd('[Scheduler] updateLINEMovies');
  });

  cron.schedule('15 * * * *', async () => {
    console.time('[Scheduler] updatePttArticles');
    await updatePttArticles(schedulerSetting.pttPagePerTime);
    console.timeEnd('[Scheduler] updatePttArticles');
  });

  cron.schedule('20 * * * *', async () => {
    await cacheManager.setRecentMoviesCache();
    await updateMoviesSchedules();
    await cacheManager.setMoviesSchedulesCache();
  });

  cron.schedule('30 5 * * *', async () => {
    console.time('[Scheduler] updateTheaterWithLocationList');
    await updateTheaterWithLocationList();
    console.timeEnd('[Scheduler] updateTheaterWithLocationList');
  });

  cron.schedule('40 5 * * *', async () => {
    console.time('[Scheduler] cacheManager.init');
    await cacheManager.init();
    console.timeEnd('[Scheduler] cacheManager.init');
  });

  cron.schedule('30 6 * * *', async () => {
    console.time('[Scheduler] updateImdbInfo');
    await updateImdbInfo();
    console.timeEnd('[Scheduler] updateImdbInfo');
  });
}
