export default class MovieBase {
  // It is actually ObjectId, however we can not directly reference ObjectId
  // because it will bring MongoDB reference into frontend
  _id?: ObjectIdLike;
  yahooId?: number;
  lineMovieId?: string;
  posterUrl?: string;
  chineseTitle?: string;
  englishTitle?: string;
  releaseDate?: string;
  types?: string[];
  runTime?: string;
  directors?: string[];
  actors?: string[];
  launchCompany?: string;
  yahooRating?: string;
  imdbRating?: string;
  lineRating?: string;
  summary?: string;
  lineUrlHash?: string;
  lineTrailerHash?: string;
}

interface ObjectIdLike {
  toHexString: () => string;
}
