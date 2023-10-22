import * as fetch from "isomorphic-fetch";

export async function getPlayingMovies(): Promise<LINEMovieResponse> {
  try {
    const res = await fetch("https://today.line.me/webapi/movie/incinemas/listings/inCinemas?offset=0&length=200&country=tw&tag=PLAYING");
    
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    
    const response: LINEMovieResponse = await res.json();
    
    // Now you can work with the 'response' data.
    console.log(response); // Replace this with your desired processing logic.

    return response;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
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