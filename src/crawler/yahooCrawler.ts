import * as cheerio from 'cheerio';
import MovieBase from '../models/movieBase';

export async function getYahooMovieInfo(yahooId: number): Promise<MovieBase> {
  const yahooMovieUrl = 'https://movies.yahoo.com.tw/movieinfo_main.html/id=' + yahooId;
  const response = await fetch(yahooMovieUrl, { redirect: 'manual' });

  if (response.status >= 300) {
    throw new Error(`${yahooMovieUrl} 404 not found`);
  }

  const body = await response.text();
  const $ = cheerio.load(body, { decodeEntities: false });
    const $movieInfoDiv = $('.movie_intro_info_r');
    const $movieInfoValues = $movieInfoDiv.find('>span');
    const posterUrl = $('.movie_intro_foto>img').attr('src');
    const fullSummary = $('.gray_infobox_inner>span').attr('title2');
    const summary = fullSummary || $('.gray_infobox_inner>span').eq(0).html().trim();
    const imdbRatingMatch = /\d{1}\.?\d{1}?/.exec($movieInfoValues.eq(3).text());
    const movieInfo: MovieBase = {
      yahooId,
      posterUrl,
      chineseTitle: $movieInfoDiv.find('h1').text(),
      englishTitle: $movieInfoDiv.find('h3').eq(0).text(),
      releaseDate: $movieInfoValues.eq(0).text().split('：')[1],
      types: Array.from($movieInfoDiv.find('.level_name_box a')).map((a) => $(a).text().trim()),
      runTime: $movieInfoValues.eq(1).text().split('：')[1],
      directors: $movieInfoDiv
        .find('.movie_intro_list')
        .eq(0)
        .text()
        .replace('導演：', '')
        .split('、')
        .map((director) => director.trim()),
      actors: $movieInfoDiv
        .find('.movie_intro_list')
        .last()
        .text()
        .replace('演員：', '')
        .split('、')
        .map((director) => director.trim()),
      launchCompany: $movieInfoValues.eq(2).text().split('：')[1],
      yahooRating: $('.score>.score_num').text(),
      imdbRating: imdbRatingMatch ? imdbRatingMatch[0] : '',
      summary,
    };

  if (!movieInfo.chineseTitle) {
    throw new Error(`${yahooMovieUrl} can not find chineseTitle, data might got problem.`);
  }

  return movieInfo;
}
