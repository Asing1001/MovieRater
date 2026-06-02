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
  const lineMovieIds = movies.map((movie) => movie.lineMovieId).filter(Boolean);
  const persistedMovies = lineMovieIds.length
    ? await Mongo.db
        .collection<MovieBase>(COLLECTIONS.movieBases)
        .find({ lineMovieId: { $in: lineMovieIds } })
        .toArray()
    : [];
  console.log('Updated LINEMovies success.');
  return persistedMovies;
}

async function mapLineMovieToMovieBase(item: LINEMovieItem): Promise<MovieBase | null> {
  const lineRating = item.rating ? item.rating.average.toFixed(1) : undefined;

  const trailer = await getLINETrailer(item);
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
    lineTrailerHash: trailer.articleHash,
    lineTrailerMediaHash: trailer.mediaHash,
    lineTrailerThumbnailHash: trailer.thumbnailHash,
  };
  return movie;
}

async function getLINETrailer(item: LINEMovieItem) {
  const trailer = item.mainTrailer ?? item.trailers?.[0] ?? null;
  const articleHash = trailer?.url?.hash ?? item.latestTrailer?.hash ?? null;
  const fallbackMediaHash = trailer?.thumbnail?.type === 'VIDEO' ? trailer.thumbnail.hash : null;
  const fallbackThumbnailHash = trailer?.thumbnail?.type === 'IMAGE' ? trailer.thumbnail.hash : null;

  if (!articleHash) {
    return { articleHash: null, mediaHash: fallbackMediaHash, thumbnailHash: fallbackThumbnailHash };
  }

  try {
    const article = await getLINEArticle(articleHash);
    const media = article?.data?.media;
    return {
      articleHash,
      mediaHash: media?.hash ?? fallbackMediaHash,
      thumbnailHash: media?.thumbnailHash ?? fallbackThumbnailHash,
    };
  } catch (error) {
    console.error(error);
  }
  return { articleHash, mediaHash: fallbackMediaHash, thumbnailHash: fallbackThumbnailHash };
}
