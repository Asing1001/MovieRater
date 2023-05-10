import { getTheaterList } from '../crawler/theaterCrawler';
import { getYahooMovieInfo } from '../crawler/yahooCrawler';
import { Mongo } from '../data/db';
import Theater from '../models/theater';
import * as Q from 'q';
import Schedule from '../models/schedule';
import { getGeoLocation } from '../thirdPartyIntegration/googleMapApi';

export async function updateTheaterWithLocationList() {
  const theaterList = await getTheaterList();
  console.time('bindingTheaterListWithLocation');
  const theaterListWithLocation = await bindingTheaterListWithLocation(
    theaterList
  );
  console.timeEnd('bindingTheaterListWithLocation');
  return Promise.all(
    theaterListWithLocation.map((theater) =>
      Mongo.updateDocument({ name: theater.name }, theater, 'theaters')
    )
  );
}

function bindingTheaterListWithLocation(theaterList: Theater[]) {
  return Promise.all(
    theaterList.map(async (theater) => {
      const location = await getGeoLocation(theater.address);
      if (location.lat) {
        return Object.assign(theater, {
          location,
        });
      }
      return theater;
    })
  );
}

export async function updateYahooMovies(howManyPagePerTime) {
  const range = await getCurrentCrawlRange(howManyPagePerTime);
  const yahooMovies = await getRangeYahooMovies(range);
  updateMaxYahooId(yahooMovies, range.startYahooId);
  await Promise.all(
    yahooMovies.map((yahooMovie) =>
      Mongo.updateDocument(
        { yahooId: yahooMovie.yahooId },
        yahooMovie,
        'yahooMovies'
      )
    )
  );
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getCurrentCrawlRange(howManyPagePerTime) {
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, 'configs');
  const startYahooId = crawlerStatus.lastCrawlYahooId + 1;
  return { startYahooId, endYahooId: startYahooId + howManyPagePerTime - 1 };
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
    if (result.state === 'fulfilled') {
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
  const maxCrawledYahooId = Math.max(...movieIds, startYahooId);
  const alreadyCrawlTheNewest = maxCrawledYahooId === startYahooId;
  if (alreadyCrawlTheNewest) {
    Mongo.updateDocument(
      crawlerStatusFilter,
      { lastCrawlYahooId: 0 },
      'configs'
    );
  } else {
    Mongo.updateDocument(
      crawlerStatusFilter,
      { maxYahooId: maxCrawledYahooId, lastCrawlYahooId: maxCrawledYahooId },
      'configs'
    );
  }
  console.log(
    `new movieInfo count:${yahooMovies.length}, lastCrawlYahooId:${maxCrawledYahooId}`
  );
}
