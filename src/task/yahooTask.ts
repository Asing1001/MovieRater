import { getTheaterList } from '../crawler/theaterCrawler';
import { getYahooMovieInfo } from '../crawler/yahooCrawler';
import crawlyahooMovieSchdule from '../crawler/yahooMovieSchduleCrawler';
import { db } from '../data/db';
import Theater from '../models/theater';
import * as Q from "q";
import Schedule from '../models/schedule';
import { getGeoLocation } from '../thirdPartyIntegration/googleMapApi';

export async function getMoviesSchedules(yahooIds: Array<number>) {
    console.time('setMoviesSchedulesCache');
    let schedulesPromise = yahooIds.map(yahooId => crawlyahooMovieSchdule(yahooId));
    const schedules = await Promise.all(schedulesPromise);
    const allSchedules: Schedule[] = [].concat(...schedules);
    console.timeEnd('setMoviesSchedulesCache');
    return allSchedules;
}

export async function getMoviesSchedulesWithLocation(allSchedules: Schedule[]) {
    const theaterListWithLocation = await getTheaterWithLocationList();
    updateTheaterList(theaterListWithLocation);
    const allSchedulesWithLocation = allSchedules.map(schdule => {
        const findTheaterExtension = theaterListWithLocation.find(({ name }) => name === schdule.theaterName)
        schdule.theaterExtension = findTheaterExtension ? findTheaterExtension : new Theater();
        return schdule
    });
    return allSchedulesWithLocation;
}

async function getTheaterWithLocationList() {
    const theaterList = await getTheaterList();
    console.time('bindingTheaterListWithLocation');
    const theaterListWithLocation = await bindingTheaterListWithLocation(theaterList);
    console.timeEnd('bindingTheaterListWithLocation');
    return theaterListWithLocation;
}

function bindingTheaterListWithLocation(theaterList: Theater[]) {
    return Promise.all(theaterList.map(async (theater) => {
        const location = await getGeoLocation(theater.address)
        if (location.lat) {
            return Object.assign(theater, {
                location
            })
        }
        return theater;
    }));
}

export async function updateTheaterList(theaterListWithLocation) {
    return Promise.all(theaterListWithLocation.map(theater => db.updateDocument({ name: theater.name }, theater, 'theaters')));
}

export async function updateYahooMovies(howManyPagePerTime) {
    const range = await getCurrentCrawlRange(howManyPagePerTime);
    const yahooMovies = await getRangeYahooMovies(range);
    updateMaxYahooId(yahooMovies, range.startYahooId);
    await Promise.all(yahooMovies.map(yahooMovie => db.updateDocument({ yahooId: yahooMovie.yahooId }, yahooMovie, "yahooMovies")))
}

const crawlerStatusFilter = { name: "crawlerStatus" };
async function getCurrentCrawlRange(howManyPagePerTime) {
    const crawlerStatus = await db.getDocument(crawlerStatusFilter, "configs");
    const startYahooId = crawlerStatus.maxYahooId + 1;
    return { startYahooId, endYahooId: startYahooId + howManyPagePerTime - 1 }
}

async function getRangeYahooMovies({ startYahooId, endYahooId }) {
    const promises = [];
    for (let i = startYahooId; i <= endYahooId; i++) {
        const promise = getYahooMovieInfo(i);
        promises.push(promise);
    }

    const results = await Q.allSettled(promises);
    let yahooMovies = [];
    results.forEach((result) => {
        if (result.state === "fulfilled") {
            var value = result.value;
            yahooMovies.push(value);
        } else {
            var reason = result.reason;
            console.error(reason);
        }
    });
    return yahooMovies;
}

function updateMaxYahooId(yahooMovies, startYahooId) {
    const movieIds = yahooMovies.map(({ yahooId }) => yahooId);
    let newMaxYahooId = Math.max(...movieIds, startYahooId);
    const alreadyCrawlTheNewest = newMaxYahooId === startYahooId;
    if (alreadyCrawlTheNewest) {
        newMaxYahooId = 1;
    }
    db.updateDocument(crawlerStatusFilter, { maxYahooId: newMaxYahooId }, 'configs');
    console.log(`new movieInfo count:${yahooMovies.length}, newMaxYahooId:${newMaxYahooId}`);
}
