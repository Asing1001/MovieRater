import * as moment from 'moment';
import { Mongo } from '../data/db';
import cacheManager from '../data/cacheManager';
import { getIMDBMovieInfo } from '../crawler/imdbCrawler';
import Movie from '../models/movie';

export async function updateImdbInfo() {
  const movieInfos = await getNewImdbInfos();
  logResult(movieInfos);
  await updateNewImdbInfos(movieInfos);
}

const imdbLastCrawlTimeFormat = 'YYYY-MM-DDTHH';
async function getNewImdbInfos() {
  const imdbLastCrawlTime = moment().format(imdbLastCrawlTimeFormat);
  const allMovies: Movie[] = cacheManager.get(cacheManager.All_MOVIES);
  const promises = allMovies.filter(filterNeedCrawlMovie).map(async (movie) => {
    const imdbInfo = await getIMDBMovieInfo(movie);
    const movieInfo: Movie = {
      ...imdbInfo,
      yahooId: movie.yahooId,
      imdbLastCrawlTime,
    };
    return movieInfo;
  });
  return Promise.all(promises);
}

function filterNeedCrawlMovie({ englishTitle, releaseDate }: Movie) {
  const now = moment();
  const isRecentMovie = now.diff(moment(releaseDate), 'months') <= 6;
  const shouldCrawl = englishTitle && isRecentMovie;
  return shouldCrawl;
}

function logResult(movieInfos: Movie[]) {
  const foundMovies = movieInfos.filter((movie) => movie.imdbID);
  const notfoundMovieIds = movieInfos
    .filter((movie) => !movie.imdbID)
    .map((movie) => movie.yahooId);
  console.log(
    `Found imdbInfos: ${foundMovies.length}, NotFound: ${notfoundMovieIds.length}`
  );
  console.log(`Not found YahooIds: ${notfoundMovieIds}`);
}

async function updateNewImdbInfos(movieInfos: Movie[]) {
  var promises = movieInfos.map(
    ({ yahooId, imdbID, imdbRating, imdbLastCrawlTime }) => {
      const newInfo = imdbID
        ? { imdbID, imdbRating, imdbLastCrawlTime }
        : { imdbLastCrawlTime };
      return Mongo.updateDocument({ yahooId }, newInfo, 'yahooMovies');
    }
  );
  await Promise.all(promises);
}
