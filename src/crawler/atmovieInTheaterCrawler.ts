import { getCheerio$ } from '../helper/util';

const inTheaterUrl = 'http://www.atmovies.com.tw/movie/now/';
export async function getInTheaterMovieNames() {
    let movieName = [];
    try {
        const $ = await getCheerio$(inTheaterUrl);
        movieName = Array.from($('.filmListPA>li>a')).map(a=>$(a).text().trim());
        if(!movieName.length) {
            console.warn('getInTheaterMovieNames got 0 movie, the class may have been changed!')
        }
        console.log(movieName)
    } catch (error) {
        console.error('getInTheaterMovieNames fail!!')
        console.error(error);
    }
    
    return movieName;
}