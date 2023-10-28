import MovieBase from '../models/movieBase';
import Movie from '../models/movie';
import Article from '../models/article';
import * as moment from 'moment';
import isValideDate from '../helper/isValideDate';

export function mergeData(yahooMovies: Array<MovieBase>, allArticles: Article[]): Movie[] {
  const mergedMovies = yahooMovies.map(mergeByChineseTitle);
  return mergedMovies;

  function mergeByChineseTitle({ _id, ...movieBase }: MovieBase): Movie {
    const chineseTitle = movieBase.chineseTitle;
    const releaseDate = isValideDate(movieBase.releaseDate) ? moment(movieBase.releaseDate) : moment();
    const rangeStart = releaseDate.clone().subtract(3, 'months');
    const rangeEnd = releaseDate.clone().add(6, 'months');
    const relatedArticles = allArticles.filter(({ title, date }: Article) => {
      const isChinesetitleMatch = title.indexOf(chineseTitle) !== -1;
      if (isChinesetitleMatch) {
        const articleFullDate = moment(date, 'YYYY/MM/DD');
        const isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
        return isInNearMonth;
      }
      return isChinesetitleMatch;
    });

    return {
      ...movieBase,
      movieBaseId: _id.toHexString(),
      relatedArticles,
    };
  }
}
