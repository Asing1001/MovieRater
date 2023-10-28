import * as request from 'request';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import Article from '../models/article';
import PttPage from '../models/pttPage';
import MovieBase from '../models/movieBase';
import cacheManager from '../data/cacheManager';

export function getPttPage(index): Promise<PttPage> {
  return new Promise((resolve, reject) => {
    const pttPageUrl = `https://www.ptt.cc/bbs/movie/index${index}.html`;
    request(pttPageUrl, (error, r, html: string) => {
      if (error) {
        reject(error);
        return;
      }
      const $ = cheerio.load(html);
      const $articleInfoDivs = $('.r-ent');
      if (!$articleInfoDivs.length) {
        let serverReturn = $('.bbs-screen.bbs-content').text();
        reject(`index${index} not exist, server return:${serverReturn}`);
        return;
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
      const pageInfo = {
        pageIndex: index,
        url: pttPageUrl,
        articles: articleInfos,
      };

      resolve(pageInfo);
    });
  });
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
