import moment = require("moment");
import { LINEMovieItem, getPlayingMovies } from "../crawler/lineCrawler";
import YahooMovie from "../models/yahooMovie";
import { Mongo } from '../data/db';

export async function updateLINEMovies() {
  const playingMovies = await getPlayingMovies() 
  console.log('Got playingMovies, total count:', playingMovies.totalCount);
  
  const yahooMovies = playingMovies.items.map(mapToYahooMovieModel)  
  await Promise.all(
    yahooMovies.map((yahooMovie) =>
      Mongo.updateDocument(
        { lineMovieId: yahooMovie.lineMovieId },
        yahooMovie,
        'yahooMovies'
      )
    )
  );
  console.log('Updated LINEMovies success.');
}

function mapToYahooMovieModel(item: LINEMovieItem): YahooMovie | null {
  const yahooMovie: YahooMovie = {
    lineMovieId: item.id,
    lineUrlHash: item.url.hash,
    posterUrl: `https://obs.line-scdn.net/${item.thumbnail.hash}/w280`,
    chineseTitle: item.title,
    englishTitle: item.engTitle,
    releaseDate: moment(item.releaseDate).format("YYYY-MM-DD"),
    types: item.genres,
    runTime: item.runtime.toString(),
    directors: item.directors,
    actors: item.cast,
    launchCompany: item.production,
    lineRating: item.rating.average.toFixed(1),
    summary: item.shortDescription,
  };
  return yahooMovie;
}