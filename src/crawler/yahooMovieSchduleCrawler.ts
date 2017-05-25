import { getCheerio$ } from '../helper/util';
import Schedule from '../models/schedule';

const yahooMovieSchduleUrl = 'https://tw.movies.yahoo.com/movietime_result.html?id=';
export default async function crawlyahooMovieSchdule(yahooId) {
    let schedules: Schedule[] = [];
    try {
        const $ = await getCheerio$(`${yahooMovieSchduleUrl + yahooId}`)
        const $items = $('.row-container .item');
        schedules = Array.from($items).map(element => {
            let $ele = $(element);
            let schedule: Schedule = {
                yahooId,
                theaterName: $ele.find('a').text(),
                timesValues: Array.from($ele.find('.tmt')).map((time) => $(time).attr('title')),
                timesStrings: Array.from($ele.find('.tmt')).map((time) => $(time).text()),
                roomTypes: Array.from($ele.find('.mvtype>img')).map((img) => {
                    const imgSrc = $(img).attr('src');
                    const match = /icon_([\w]*).gif/.exec(imgSrc);
                    return match ? match[1] : '';
                }),
            }
            return schedule;
        });
    }
    catch (error) {
        console.error(error);
    }
    return schedules;
}