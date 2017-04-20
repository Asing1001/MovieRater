import { getTheaterList } from '../crawler/theaterCrawler';
import { getYahooMovieInfo } from '../crawler/yahooCrawler';
import { db } from '../data/db';
import Theater from '../models/theater';
import * as Q from "q";

export async function updateTheaterList() {
    const theaterList = await getTheaterList();
    return Promise.all(theaterList.map(theater => db.updateDocument({ name: theater.name }, theater, 'theaters')));
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