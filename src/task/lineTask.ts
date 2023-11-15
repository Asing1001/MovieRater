import moment = require('moment');
import { LINEMovieItem, getLINEArticle, getPlayingMovies } from '../crawler/lineCrawler';
import MovieBase from '../models/movieBase';
import { Mongo } from '../data/db';
import { promiseMap } from '../helper/promiseMap';

export async function updateLINEMovies() {
  const playingMovies = await getPlayingMovies();
  console.log('Got playingMovies, total count:', playingMovies.totalCount);
  const movies = await promiseMap(
    playingMovies.items,
    async (item) => {
      const movie = await mapToYahooMovieModel(item);
      await Mongo.updateDocument({ lineMovieId: movie.lineMovieId }, movie, 'yahooMovies');
      return movie;
    },
    { concurrency: 10 }
  );
  console.log('Updated LINEMovies success.');
  return movies;
}

async function mapToYahooMovieModel(item: LINEMovieItem): Promise<MovieBase | null> {
  const lineRating = item.rating ? item.rating.average.toFixed(1) : undefined;

  const movie: MovieBase = {
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
    lineTrailerHash: await getLINETrailerHash(item),
  };
  return movie;
}

async function getLINETrailerHash(item: LINEMovieItem) {
  // if the trailer type is not video, get article from trailer url hash, and then get the response.data.media.hash
  try {
    if (item.mainTrailer) {
      const trailer = item.mainTrailer;
      const lineTrailerThumbnail = trailer.thumbnail;
      if (lineTrailerThumbnail && lineTrailerThumbnail.type === 'VIDEO') {
        return lineTrailerThumbnail.hash || null;
      } else if (trailer.url && trailer.url.hash) {
        const article = await getLINEArticle(trailer.url.hash);
        return article.data.media.hash || null;
      }
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
