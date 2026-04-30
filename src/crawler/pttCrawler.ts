import * as cheerio from 'cheerio';
import moment from 'moment';
import Article from '../models/article';
import PttPage from '../models/pttPage';
import MovieBase from '../models/movieBase';
import cacheManager from '../data/cacheManager';

export async function getPttPage(index: number): Promise<PttPage> {
  const pttPageUrl = `https://www.ptt.cc/bbs/movie/index${index}.html`;
  const response = await fetch(pttPageUrl);
  const html = await response.text();
  const $ = cheerio.load(html);
  const $articleInfoDivs = $('.r-ent');
  if (!$articleInfoDivs.length) {
    const serverReturn = $('.bbs-screen.bbs-content').text() || `${response.status} - ${response.statusText}`;
    throw new Error(`index${index} not exist, server return:${serverReturn}`);
  }
  const articleInfos = Array.from($articleInfoDivs).map((articleInfoDiv) => {
    let $articleInfoDiv = $(articleInfoDiv);
    let articleUrl = $articleInfoDiv.find('.title>a').attr('href');
    let articleHasDeleted = !articleUrl;
    let date = articleHasDeleted
      ? moment().format('YYYY/MM/DD')
      : moment(parseInt(articleUrl.split('.')[1]) * 1000).format('YYYY/MM/DD');
    let articleTitle = $articleInfoDiv.find('.title>a').text();
    const articleInfo: Article = {
      title: articleTitle,
      push: $articleInfoDiv.find('.nrec>.hl').text(),
      url: articleUrl,
      date: date,
      author: $articleInfoDiv.find('.meta>.author').text(),
    };
    return articleInfo;
  });
  return {
    pageIndex: index,
    url: pttPageUrl,
    articles: articleInfos,
  };
}

export function getMatchedYahooId(articleTitle, date) {
  let matchedYahooMovie: MovieBase = cacheManager.get(cacheManager.All_MOVIES).find((yahooMovie: MovieBase) => {
    let releaseDate = moment(yahooMovie.releaseDate);
    let releaseYear = releaseDate.year();
    let rangeStart = releaseDate.clone().subtract(3, 'months');
    let rangeEnd = releaseDate.clone().add(6, 'months');
    let articleFullDate = moment(date, 'YYYY/MM/DD');
    let isInNearMonth = articleFullDate.isBetween(rangeStart, rangeEnd);
    let isChinesetitleMatch = articleTitle.indexOf(yahooMovie.chineseTitle) !== -1;
    return isChinesetitleMatch && isInNearMonth;
  });
  return matchedYahooMovie ? matchedYahooMovie.yahooId : null;
}
