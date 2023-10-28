import * as request from 'request';
import * as cheerio from 'cheerio';
import * as Q from 'q';
import MovieBase from '../models/movieBase';

export function getYahooMovieInfo(yahooId: number) {
  const defer = Q.defer();
  const yahooMovieUrl = 'https://movies.yahoo.com.tw/movieinfo_main.html/id=' + yahooId;
  var req = request({ url: yahooMovieUrl, followRedirect: false }, (error, res, body) => {
    if (error) {
      let reason = `error occur when request ${yahooMovieUrl}, error:${error}`;
      return defer.reject(reason);
    }

    if (res.headers.location) {
      let reason = `${yahooMovieUrl} 404 not found`;
      return defer.reject(reason);
    }

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
      let reason = `${yahooMovieUrl} can not find chineseTitle, data might got problem.`;
      return defer.reject(reason);
    }

    return defer.resolve(movieInfo);
  });
  return defer.promise;
}
