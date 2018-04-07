import { getCheerio$ } from '../helper/util';
import Schedule from '../models/schedule';
import * as moment from 'moment';

const movieSchduleUrl = 'http://www.atmovies.com.tw';
export async function crawlMovieSchdule(scheduleUrl, date) {
    let schedules: Schedule[] = [];
    try {
        const isToday = moment().format('YYYYMMDD') === date;
        const $ = await getCheerio$(`${movieSchduleUrl + scheduleUrl}${isToday ? '' : date + '/'}`)
        schedules = Array.from($('#theaterShowtimeTable')).map(showTime => {
            const $showTime = $(showTime);
            const roomTypesString = $showTime.find('.filmVersion').text();
            const schedule: Schedule = {
                date,
                scheduleUrl,
                movieName: $showTime.find('.filmTitle>a').text(),
                roomTypes: roomTypesString !== "" ? roomTypesString.split(',') : [],
                level: $showTime.find('img[hspace]').attr('src'),
                timesStrings: Array.from($showTime.find('li>ul:nth-child(2)').children(':not([class])')).map((e) => $(e).text().substr(0,5))
            }
            return schedule;
        });
    }
    catch (error) {
        console.error(error);
    }
    return schedules;
}