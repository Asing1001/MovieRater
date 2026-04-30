import { crawlMovieSchdule } from '../crawler/movieSchduleCrawler';
import Schedule from '../models/schedule';
import moment from 'moment';
import { Mongo } from '../data/db';
import Redis from 'ioredis';
import { systemSetting } from '../configs/systemSetting';
import { promiseMap } from '../helper/promiseMap';

const redisClient = new Redis(systemSetting.redisUrlForScheduler);
redisClient.on('error', (err) => console.log('Redis error: ' + err));

export async function updateMoviesSchedules(): Promise<Schedule[]> {
  const scheduleUrls = await Mongo.db
    .collection<{ scheduleUrl: string }>('theaters')
    .find({}, { projection: { scheduleUrl: 1, _id: 0 } })
    .toArray();
  const scheduleCrawlDate = await getScheduleCrawlDate();
  console.log('scheduleCrawlDate', scheduleCrawlDate);
  const schedules = await promiseMap(
    scheduleUrls,
    ({ scheduleUrl }) => crawlMovieSchdule(scheduleUrl, scheduleCrawlDate),
    { concurrency: 15, delay: 100 }
  );
  const allSchedules = [].concat(...schedules);
  console.log('allSchedules.length', allSchedules.length);
  redisClient.setex(scheduleCrawlDate, 86400 * 2, JSON.stringify(allSchedules));
  return allSchedules;
}

export async function getMoviesSchedules(): Promise<Schedule[]> {
  const multi = redisClient.multi();
  for (let i = 0; i < 7; i++) {
    multi.get(moment().add(i, 'days').format('YYYYMMDD'));
  }
  const replies = await multi.exec();
  console.log('getMoviesSchedules got ' + replies.length + ' replies');
  const schedules: Schedule[] = [].concat(
    ...replies
      .filter(([err, reply]) => !err && reply !== null)
      .map(([, reply]) => JSON.parse(reply as string))
  );
  return schedules;
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getScheduleCrawlDate() {
  let resultDay = 0;
  const { scheduleDay: currentScheduleDay } = await Mongo.getDocument(crawlerStatusFilter, 'configs');
  if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
    resultDay = currentScheduleDay + 1;
  }
  UpdateScheduleCrawlDate(resultDay);
  return moment().add(resultDay, 'days').format('YYYYMMDD');
}

function UpdateScheduleCrawlDate(day) {
  Mongo.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}
