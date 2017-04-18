import * as memoryCache from 'memory-cache';
import { db } from "../data/db";
import * as Q from "q";
import { mergeData } from '../crawler/mergeData';
import * as moment from 'moment';
import Movie from '../models/movie';
import { crawlInTheater } from '../crawler/yahooInTheaterCrawler';
import crawlyahooMovieSchdule from '../crawler/yahooMovieSchduleCrawler';


export default class cacheManager {
    static All_MOVIES = 'allMovies';
    static All_MOVIES_NAMES = 'allMoviesNames';
    static RECENT_MOVIES = 'recentMovies';
    static MOVIES_SCHEDULES = 'MoviesSchedules';
    static async init() {
        const yahooMoviesPromise = db.getCollection("yahooMovies", { yahooId: -1 });
        const pttArticlesPromise = db.getCollection("pttArticles");
        console.time('get yahooMovies and pttArticles');
        const [yahooMovies, pttArticles] = await Promise.all([yahooMoviesPromise, pttArticlesPromise]);
        console.timeEnd('get yahooMovies and pttArticles');
        cacheManager.setAllMoviesNamesCache(yahooMovies);
        cacheManager.setAllMoviesCache(yahooMovies, pttArticles);
        cacheManager.setRecentMoviesCache();
    }

    private static setAllMoviesNamesCache(yahooMovies: Array<Movie>) {
        let allMoviesName = [];
        console.time('setAllMoviesNamesCache');
        yahooMovies.forEach(({ chineseTitle, englishTitle, yahooId, releaseDate }) => {
            if (chineseTitle) {
                allMoviesName.push({ value: yahooId, text: chineseTitle });
            }
            if (englishTitle && englishTitle !== chineseTitle) {
                allMoviesName.push({ value: yahooId, text: englishTitle });
            }
        });

        this.set(cacheManager.All_MOVIES_NAMES, allMoviesName);
        console.timeEnd('setAllMoviesNamesCache');
    }

    private static setAllMoviesCache(yahooMovies, pttArticles) {
        console.time('mergeData');
        let mergedDatas = mergeData(yahooMovies, pttArticles);
        console.timeEnd('mergeData');
        this.set(cacheManager.All_MOVIES, mergedDatas);
    }

    private static setRecentMoviesCache() {
        console.time('setRecentMoviesCache');
        return crawlInTheater().then((yahooIds: Array<number>) => {
            let today = moment();
            let recentMovies = cacheManager.get(cacheManager.All_MOVIES)
                .filter(({ yahooId, releaseDate }: Movie) => yahooIds.indexOf(yahooId) !== -1 && today.diff(moment(releaseDate), 'days') <= 90)
            this.set(cacheManager.RECENT_MOVIES, recentMovies);
            console.timeEnd('setRecentMoviesCache');

            return this.setMoviesSchedulesCache(yahooIds);
        })
    }

    private static setMoviesSchedulesCache(yahooIds: Array<number>) {
        console.time('setMoviesSchedulesCache');
        let schedulesPromise = yahooIds.map(yahooId => crawlyahooMovieSchdule(yahooId))

        return Q.all(schedulesPromise).then(schedules => {
            const allSchedules = [].concat(...schedules);
            this.set(cacheManager.MOVIES_SCHEDULES, allSchedules);
            console.timeEnd('setMoviesSchedulesCache');
        })
    }

    static get(key) {
        let data = memoryCache.get(key);
        return data;
    }

    static set(key, value) {
        memoryCache.put(key, value);
        console.log(`${key} size:${roughSizeOfObject(value)}` );
    }
}

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}