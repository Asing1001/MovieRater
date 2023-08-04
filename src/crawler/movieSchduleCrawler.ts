import { getCheerio$ } from '../helper/util';
import Schedule from '../models/schedule';
import * as moment from 'moment';

const movieSchduleUrl = 'http://www.atmovies.com.tw';
export async function crawlMovieSchdule(scheduleUrl, date) {
    let schedules: Schedule[] = [];
    const isToday = moment().format('YYYYMMDD') === date;
    const atmovieScheduleUrl = `${movieSchduleUrl + scheduleUrl}${isToday ? '' : date + '/'}`
    try {
        const $ = await getCheerio$(atmovieScheduleUrl)
        schedules = Array.from($('#theaterShowtimeTable')).map(showTime => {
            const $showTime = $(showTime);
            const roomTypesString = $showTime.find('.filmVersion').text();
            const schedule: Schedule = {
                date,
                scheduleUrl,
                movieName: $showTime.find('.filmTitle>a').text(),
                roomTypes: roomTypesString !== "" ? roomTypesString.split(',') : [],
                level: $showTime.find('img[hspace]').attr('src'),
                timesStrings: Array.from($showTime.find('li>ul:nth-child(2)').children(':not([class])')).map((e) => $(e).text().substr(0, 5))
            }
            return schedule;
        });
    }
    catch (error) {
        console.error('crawlMovieSchdule fail!');
        console.error(error);
    }
    console.log(`crawlMovieSchdule(${atmovieScheduleUrl}, ${date}), schedules.length: ${schedules.length}`)
    return schedules;
}