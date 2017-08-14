import * as request from "request";
import * as cheerio from "cheerio";
import * as Q from "q";
import YahooMovie from '../models/yahooMovie';

export function getYahooMovieInfo(yahooId: number) {
    const defer = Q.defer();
    const yahooMovieUrl = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + yahooId;
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
        const $movieInfoDiv = $('.movie_intro_info');
        const $movieInfoValues = $movieInfoDiv.find('span');
        const posterUrl = $movieInfoDiv.find('.movie_intro_foto>img').attr('src');
        const fullSummary = $('.gray_infobox_inner>span').attr('title2');
        const summary = fullSummary || $('.gray_infobox_inner>span').eq(0).html().trim()
        const movieInfo: YahooMovie = {
            yahooId,
            posterUrl,
            chineseTitle: $movieInfoDiv.find('h1').text(),
            englishTitle: $movieInfoDiv.find('h3').eq(0).text(),
            releaseDate: $movieInfoValues.eq(0).text().split('：')[1],
            types: Array.from($movieInfoDiv.find('.level_name_box a')).map(a => $(a).text().trim()),
            runTime: $movieInfoValues.eq(1).text().split('：')[1],
            directors: $movieInfoDiv.find('.movie_intro_list').eq(0).text().split('、').map(director => director.trim()),
            actors: $movieInfoDiv.find('.movie_intro_list').eq(1).text().split('、').map(director => director.trim()),
            launchCompany: $movieInfoValues.eq(2).text().split('：')[1],
            yahooRating: $('.score>.score_num').text(),
            summary
        };

        if (!movieInfo.chineseTitle) {
            let reason = `${yahooMovieUrl} can not find chineseTitle, data might got problem.`;
            return defer.reject(reason);
        }

        return defer.resolve(movieInfo);
    })
    return defer.promise;
}