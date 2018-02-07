import { getCheerio$ } from '../helper/util';
import Schedule from '../models/schedule';

const movieSchduleUrl = 'http://www.atmovies.com.tw';
export default async function crawlMovieSchdule(scheduleUrl) {
    let schedules: Schedule[] = [];
    try {
        const $ = await getCheerio$(`${movieSchduleUrl + scheduleUrl}`)
        schedules = Array.from($('#theaterShowtimeTable')).map(showTime => {
            const $showTime = $(showTime);
            const roomTypesString = $showTime.find('.filmVersion').text();
            const schedule: Schedule = {
                scheduleUrl,
                movieName: $showTime.find('.filmTitle>a').text(),
                roomTypes: roomTypesString !== "" ? roomTypesString.split(',') : [],
                level: $showTime.find('img[hspace]').attr('src'),
                timesStrings: Array.from($showTime.find('li>ul:nth-child(2)').children(':not([class])')).map((e) => $(e).text().trim())
            }
            return schedule;
        });
    }
    catch (error) {
        console.error(error);
    }
    return schedules;
}