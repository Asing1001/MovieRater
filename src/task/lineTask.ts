import moment = require('moment');
import { LINEMovieItem, getPlayingMovies } from '../crawler/lineCrawler';
import MovieBase from '../models/movieBase';
import { Mongo } from '../data/db';

export async function updateLINEMovies() {
  const playingMovies = await getPlayingMovies();
  console.log('Got playingMovies, total count:', playingMovies.totalCount);

  const yahooMovies = playingMovies.items.map(mapToYahooMovieModel);
  await Promise.all(
    yahooMovies.map((yahooMovie) =>
      Mongo.updateDocument({ lineMovieId: yahooMovie.lineMovieId }, yahooMovie, 'yahooMovies')
    )
  );
  console.log('Updated LINEMovies success.');
}

function mapToYahooMovieModel(item: LINEMovieItem): MovieBase | null {
  const lineRating = item.rating ? item.rating.average.toFixed(1) : undefined;

  const yahooMovie: MovieBase = {
    lineMovieId: item.id,
    lineUrlHash: (item.url && item.url.hash) || null,
    posterUrl: (item.thumbnail && `https://obs.line-scdn.net/${item.thumbnail.hash}/w280`) || null,
    chineseTitle: item.title,
    englishTitle: item.engTitle,
    releaseDate: moment(item.releaseDate).format('YYYY-MM-DD'),
    types: item.genres,
    runTime: item.runtime && item.runtime.toString(),
    directors: item.directors,
    actors: item.cast,
    launchCompany: item.production,
    lineRating: lineRating,
    summary: item.synopsis,
    lineTrailerHash: getLINETrailerHash(item),
  };
  return yahooMovie;
}

function getLINETrailerHash(item: LINEMovieItem) {
  // TODO: if the trailer type is not video, get article from trailer url hash, and then get the response.data.media.hash
  // https://today.line.me/webapi/portal/page/setting/article?country=tw&hash=1DODQOz&group=NA
  const lineTrailerThumbnail = item.mainTrailer && item.mainTrailer.thumbnail;
  if (lineTrailerThumbnail && lineTrailerThumbnail.type === 'VIDEO') {
    return lineTrailerThumbnail.hash || null;
  }
  return null;
}
