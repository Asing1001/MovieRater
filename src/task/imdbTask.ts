import * as moment from 'moment';
import { db } from '../data/db';
import { getIMDBMovieInfo } from '../crawler/imdbCrawler';
import Movie from "../models/movie";

export async function updateImdbInfo() {
    let movieInfos = await getNewImdbInfos();
    logResult(movieInfos);
    return updateYahooMovies(movieInfos);
}

const imdbLastCrawlTimeFormat = 'YYYY-MM-DDTHH';
async function getNewImdbInfos() {
    const imdbLastCrawlTime = moment().format(imdbLastCrawlTimeFormat);
    const yahooMovies: Movie[] = await db.getCollection("yahooMovies");
    const promises = yahooMovies.filter(filterNeedCrawlMovie).map(async ({ englishTitle, yahooId }) => {
        const imdbInfo = await getIMDBMovieInfo(englishTitle);
        const movieInfo: Movie = Object.assign(imdbInfo, {
            yahooId,
            imdbLastCrawlTime
        });
        return movieInfo;
    });
    return Promise.all(promises);
}

function filterNeedCrawlMovie({ englishTitle, releaseDate, imdbLastCrawlTime }: Movie) {
    let now = moment();
    let isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
    let hasCrawlNearly = imdbLastCrawlTime && (now.diff(moment(imdbLastCrawlTime, imdbLastCrawlTimeFormat), 'hours') <= 12);
    let shouldCrawl = !hasCrawlNearly && englishTitle && (isRecentMovie || (!isRecentMovie && !imdbLastCrawlTime));
    return shouldCrawl;
}

function logResult(movieInfos: Movie[]) {
    const foundMovies = movieInfos.filter(movie => movie.imdbID);
    const notfoundMovieIds = movieInfos.filter(movie => !movie.imdbID).map(movie => movie.yahooId);
    console.log(`Found imdbInfos: ${foundMovies.length}, NotFound: ${notfoundMovieIds.length}`);
    console.log(`Not found YahooIds: ${notfoundMovieIds}`);
}

function updateYahooMovies(movieInfos: Movie[]) {
    return movieInfos.map(({ yahooId, imdbID, imdbRating, imdbLastCrawlTime }) => {
        const newInfo = imdbID ? { imdbID, imdbRating, imdbLastCrawlTime } : { imdbLastCrawlTime }
        return db.updateDocument({ yahooId }, newInfo, "yahooMovies")
    })
}