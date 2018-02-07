import crawlMovieSchdule from '../crawler/movieSchduleCrawler';
import Schedule from '../models/schedule';

export async function getMoviesSchedules(scheduleUrls: Array<string>) {
    let schedulesPromise = scheduleUrls.map(scheduleUrl => crawlMovieSchdule(scheduleUrl));
    const schedules = await Promise.all(schedulesPromise);
    const allSchedules: Schedule[] = [].concat(...schedules);
    return allSchedules;
}