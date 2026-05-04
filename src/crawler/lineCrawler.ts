import { LINEPage } from '../models/LINEPage';

export async function getPlayingMovies(): Promise<LINEMovieResponse> {
  try {
    const res = await fetch(
      'https://today.line.me/webapi/movie/incinemas/listings/inCinemas?offset=0&length=200&country=tw'
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const response: LINEMovieResponse = await res.json();
    return response;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

export async function getComingSoonMovies(startMonth: string, offset = 0, length = 100): Promise<LINEMovieResponse> {
  try {
    const params = new URLSearchParams({
      offset: String(offset),
      length: String(length),
      country: 'tw',
      startMonth,
    });
    const res = await fetch(`https://today.line.me/webapi/movie/comingsoon/listings/comingSoon?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const response: LINEMovieResponse = await res.json();
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
  thumbnail?: {
    type: string;
    hash: string;
  } | null;
  url?: {
    hash: string;
  } | null;
  movieId: string;
  movieGroupId?: string;
  engTitle: string;
  broadcastStatus: string;
  certificate: string;
  releaseDate: number;
  rating?: {
    totalScore: number;
    count: number;
    average: number;
  } | null;
  genres?: string[] | null;
  runtime?: number | null;
  showtimeCount: number;
  directors?: string[] | null;
  cast?: string[] | null;
  latestTrailer?: {
    hash: string;
  } | null;
  mainTrailer?: {
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
  } | null;
  bookable?: boolean;
  source: string;
  likeCount?: number | null;
  badgeText?: string;
  shortDescription?: string;
  writers?: string[];
  production?: string;
  synopsis?: string;
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
  commentSetting?: string;
  manualTags: string[];
}
