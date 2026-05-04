import moment from 'moment';
import { LINEMovieItem, getLINEArticle, getPlayingMovies } from '../crawler/lineCrawler';
import MovieBase from '../models/movieBase';
import { COLLECTIONS } from '../data/collections';
import { Mongo } from '../data/db';
import { promiseMap } from '../helper/promiseMap';
import { cleanMovieSummary } from '../lib/text';

export async function updateLINEMovies() {
  const playingMovies = await getPlayingMovies();
  console.log('Got playingMovies, total count:', playingMovies.totalCount);
  const movies = await promiseMap(
    playingMovies.items,
    async (item) => {
      const movie = await mapLineMovieToMovieBase(item);
      await Mongo.updateDocument({ lineMovieId: movie.lineMovieId }, movie, COLLECTIONS.movieBases);
      return movie;
    },
    { concurrency: 10 }
  );
  console.log('Updated LINEMovies success.');
  return movies;
}

async function mapLineMovieToMovieBase(item: LINEMovieItem): Promise<MovieBase | null> {
  const lineRating = item.rating ? item.rating.average.toFixed(1) : undefined;

  const movie: MovieBase = {
    lineMovieId: item.id,
    lineMovieDbId: item.movieId,
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
    summary: cleanMovieSummary(item.synopsis),
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
