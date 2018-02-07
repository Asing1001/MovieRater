import { getCheerio$ } from '../helper/util';

const inTheaterUrl = 'http://www.atmovies.com.tw/movie/now/';
export async function getInTheaterMovieNames() {
    let movieName = [];
    try {
        const $ = await getCheerio$(inTheaterUrl);
        movieName = Array.from($('.filmListAll2>li>a')).map(a=>$(a).text());
    } catch (error) {
        console.error(error);
    }
    return movieName;
}