import * as cheerio from 'cheerio';
import moment from 'moment';
import Article from '../models/article';
import PttPage from '../models/pttPage';
import Movie from '../models/movie';
import cacheManager from '../data/cacheManager';
import isValideDate from '../helper/isValideDate';

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
  const articleInfos = Array.from($articleInfoDivs).map((div) => {
    const $div = $(div);
    const articleUrl = $div.find('.title>a').attr('href');
    if (!articleUrl) return null;  // skip deleted articles
    return {
      title: $div.find('.title>a').text(),
      push: $div.find('.nrec>.hl').text(),
      url: 'https://www.ptt.cc' + articleUrl,
      date: moment(parseInt(articleUrl.split('.')[1]) * 1000).format('YYYY/MM/DD'),
      author: $div.find('.meta>.author').text(),
    } as Article;
  }).filter(Boolean);
  return {
    pageIndex: index,
    url: pttPageUrl,
    articles: articleInfos,
  };
}

export function findMovieBaseId(articleTitle: string, date: string): string | null {
  const allMovies: Movie[] = cacheManager.get(cacheManager.All_MOVIES) ?? [];
  const articleDate = moment(date, 'YYYY/MM/DD');
  const matched = allMovies.find((movie) => {
    if (!movie.chineseTitle || movie.chineseTitle.length < 2) return false;
    if (!articleTitle.includes(movie.chineseTitle)) return false;
    const releaseDate = isValideDate(movie.releaseDate) ? moment(movie.releaseDate) : moment();
    return articleDate.isBetween(
      releaseDate.clone().subtract(3, 'months'),
      releaseDate.clone().add(6, 'months')
    );
  });
  return matched?.movieBaseId ?? null;
}
