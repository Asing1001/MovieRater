import { crawlMovieSchdule } from '../crawler/movieSchduleCrawler';
import Schedule from '../models/schedule';
import * as moment from 'moment';
import { db } from '../data/db';
import * as redis from 'redis';
import { systemSetting } from '../configs/systemSetting';

const redisClient = redis.createClient(systemSetting.redisUrlForApiCache).on("error", err => console.log("Error " + err));

export async function updateMoviesSchedules() {
    const scheduleUrls = await db.getCollection({ name: "theaters", fields: { scheduleUrl: 1, _id: 0 } });
    const scheduleCrawlDate = await getScheduleCrawlDate();
    let schedulesPromise = scheduleUrls.map(({ scheduleUrl }) => crawlMovieSchdule(scheduleUrl, scheduleCrawlDate));
    const schedules = await Promise.all(schedulesPromise);
    const allSchedules: Schedule[] = [].concat(...schedules);
    redisClient.setex(scheduleCrawlDate, 86400 * 9, JSON.stringify(allSchedules));
    return allSchedules;
}

export async function getMoviesSchedules(): Promise<any> {
    return new Promise((resolve, reject) => {
        const multi = redisClient.multi();
        for (let i = 0; i < 7; i++) {
            multi.get(moment().add(i, 'days').format('YYYYMMDD'));
        }
        multi.exec((err, replies) => {
            err && console.error(err);
            console.log("MULTI got " + replies.length + " replies");
            resolve([].concat(...replies.filter(reply => reply !== null).map(reply => JSON.parse(reply))));
        })
    })
}

const crawlerStatusFilter = { name: "crawlerStatus" };
async function getScheduleCrawlDate() {
    let resultDay = 0;
    const { scheduleDay: currentScheduleDay } = await db.getDocument(crawlerStatusFilter, "configs");
    if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
        resultDay = currentScheduleDay + 1
    }
    UpdateScheduleCrawlDate(resultDay);
    return moment().add(resultDay, 'days').format('YYYYMMDD');
}

function UpdateScheduleCrawlDate(day) {
    db.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}