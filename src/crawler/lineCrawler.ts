import * as fetch from 'isomorphic-fetch';
import { LINEPage } from '../models/LINEPage';

export async function getPlayingMovies(): Promise<LINEMovieResponse> {
  try {
    const res = await fetch(
      'https://today.line.me/webapi/movie/incinemas/listings/inCinemas?offset=0&length=200&country=tw&tag=PLAYING'
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const response: LINEMovieResponse = await res.json();

    // Now you can work with the 'response' data.
    console.log(response); // Replace this with your desired processing logic.

    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

export async function getLINEArticle(hash: string) {
  // https://today.line.me/webapi/portal/page/setting/article?country=tw&hash=1DODQOz&group=NA
  try {
    const res = await fetch(
      `https://today.line.me/webapi/portal/page/setting/article?country=tw&hash=${hash}&group=NA`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const response: LINEPage = await res.json();
    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
}

export interface LINEMovieResponse {
  id: string;
  totalCount: number;
  items: LINEMovieItem[];
}

export interface LINEMovieItem {
  id: string;
  title: string;
  thumbnail: {
    type: string;
    hash: string;
  };
  url: {
    hash: string;
  };
  movieId: string;
  movieGroupId: string;
  engTitle: string;
  broadcastStatus: string;
  certificate: string;
  releaseDate: number;
  rating: {
    totalScore: number;
    count: number;
    average: number;
  };
  genres: string[];
  runtime: number;
  showtimeCount: number;
  directors: string[];
  cast: string[];
  latestTrailer: {
    hash: string;
  };
  mainTrailer: {
    id: string;
    title: string;
    publisher: string;
    publisherId: string;
    publishTimeUnix: number;
    contentType: string;
    thumbnail: {
      type: string;
      hash: string;
    };
    url: {
      hash: string;
    };
    ageLimit: boolean;
    categoryId: number;
  };
  bookable: boolean;
  source: string;
  likeCount: number;
  badgeText: string;
  shortDescription: string;
  writers: string[];
  production: string;
  synopsis: string;
  trailers: {
    id: string;
    title: string;
    publisher: string;
    publisherId: string;
    publishTimeUnix: number;
    contentType: string;
    thumbnail: {
      type: string;
      hash: string;
    };
    url: {
      hash: string;
    };
    ageLimit: boolean;
    categoryId: number;
  }[];
  pictures: {
    type: string;
    hash: string;
  }[];
  commentSetting: string;
  manualTags: string[];
}
