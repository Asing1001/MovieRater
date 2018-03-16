import crawlMovieSchdule from '../crawler/movieSchduleCrawler';
import Schedule from '../models/schedule';
import * as moment from 'moment';
import { db } from '../data/db';

export async function getMoviesSchedules(scheduleUrls: Array<string>) {
    const scheduleCrawlDay = getScheduleCrawlDay();
    let schedulesPromise = scheduleUrls.map(scheduleUrl => crawlMovieSchdule(scheduleUrl, moment().add(scheduleCrawlDay, 'days').format('YYYYMMDD')));
    const schedules = await Promise.all(schedulesPromise);
    const allSchedules: Schedule[] = [].concat(...schedules);
    return allSchedules;
}

const crawlerStatusFilter = { name: "crawlerStatus" };
async function getScheduleCrawlDay() {
    let resultDay = 0;
    const { scheduleDay: currentScheduleDay } = await db.getDocument(crawlerStatusFilter, "configs");
    if (currentScheduleDay !== undefined && currentScheduleDay < 7) {
        resultDay = currentScheduleDay + 1
    }
    UpdateScheduleCrawlDay(resultDay);
    return resultDay;
}

function UpdateScheduleCrawlDay(day) {
    db.updateDocument(crawlerStatusFilter, { scheduleDay: day }, 'configs');
}