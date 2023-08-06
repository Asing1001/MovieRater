import { crawlMovieSchdule } from '../crawler/movieSchduleCrawler';
import Schedule from '../models/schedule';
import * as moment from 'moment';
import { Mongo } from '../data/db';
import * as redis from 'redis';
import { systemSetting } from '../configs/systemSetting';
import { promiseMap } from '../helper/promiseMap';

const redisClient = redis
  .createClient(systemSetting.redisUrlForScheduler)
  .on('error', (err) => console.log('Error ' + err));

export async function updateMoviesSchedules(): Promise<Schedule[]> {
  const scheduleUrls: { scheduleUrl: string }[] = await Mongo.db
    .collection('theaters')
    .find({}, { projection: { scheduleUrl: 1, _id: 0 } })
    .toArray();
  const scheduleCrawlDate = await getScheduleCrawlDate();
  console.log('scheduleCrawlDate', scheduleCrawlDate);
  const schedules = await promiseMap(scheduleUrls, ({ scheduleUrl }) => crawlMovieSchdule(scheduleUrl, scheduleCrawlDate), 15)
  const allSchedules = [].concat(...schedules);
  console.log('allSchedules.length', allSchedules.length);
  redisClient.setex(scheduleCrawlDate, 86400 * 2, JSON.stringify(allSchedules));
  return allSchedules;
}

export async function getMoviesSchedules(): Promise<Schedule[]> {
  return new Promise<Schedule[]>((resolve, reject) => {
    const multi = redisClient.multi();
    for (let i = 0; i < 7; i++) {
      multi.get(moment().add(i, 'days').format('YYYYMMDD'));
    }
    multi.exec((err, replies) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log('getMoviesSchedules got ' + replies.length + ' replies');
      const schedules: Schedule[] = [].concat(
        ...replies
          .filter((reply) => reply !== null)
          .map((reply) => JSON.parse(reply))
      );
      resolve(schedules);
    });
  });
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getScheduleCrawlDate() {
  let resultDay = 0;
  const { scheduleDay: currentScheduleDay } = await Mongo.getDocument(
    crawlerStatusFilter,
    'configs'
  );
  if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
    resultDay = currentScheduleDay + 1;
  }
  UpdateScheduleCrawlDate(resultDay);
  return moment().add(resultDay, 'days').format('YYYYMMDD');
}

function UpdateScheduleCrawlDate(day) {
  Mongo.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}
