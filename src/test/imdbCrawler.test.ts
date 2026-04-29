import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {
  getIMDBMovieInfo,
  getIMDBRating,
  getIMDBRatingFromHtml,
  getIMDBSuggestIdFromSuggestions,
} from '../crawler/imdbCrawler';

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.should();
chai.use(chaiAsPromised);

describe('imdbCrawler', () => {
  describe('getIMDBSuggestIdFromSuggestions', () => {
    it('should match a close title when similarity is high', function () {
      const imdbID = getIMDBSuggestIdFromSuggestions(
        {
          d: [
            { id: 'tt0000001', l: 'Wrong Movie', y: 2017 },
            { id: 'tt5576318', l: 'Who Killed Cock Robin?', y: 2017 },
          ],
        },
        'Who Killed Cock Robin',
        '2017-03-31'
      );

      imdbID.should.eq('tt5576318');
    });

    it('should use release year to disambiguate less similar titles', function () {
      const imdbID = getIMDBSuggestIdFromSuggestions(
        {
          d: [
            { id: 'tt1111111', l: 'A Silent Voice', y: 2016 },
            { id: 'tt5323662', l: 'A Silent Voice: The Movie', y: 2020 },
          ],
        },
        'A Silent Voice The Movie',
        '2020-06-12'
      );

      imdbID.should.eq('tt5323662');
    });

    it('should return null when suggestions do not match', function () {
      const imdbID = getIMDBSuggestIdFromSuggestions(
        {
          d: [{ id: 'tt0000001', l: 'A Completely Different Movie', y: 2020 }],
        },
        'Girl Revenge',
        '2020-08-07'
      );

      expect(imdbID).to.be.null;
    });
  });

  describe('getIMDBRatingFromHtml', () => {
    it('should parse the aggregate rating from IMDB title HTML', function () {
      const html = `
        <div data-testid="hero-rating-bar__aggregate-rating__score">
          <span>8.4</span><span>/10</span>
        </div>
      `;

      getIMDBRatingFromHtml(html).should.eq('8.4');
    });
  });

  describe('live IMDB integration', () => {
    const liveIt = process.env.ENABLE_LIVE_CRAWLER_TESTS === 'true' ? it : it.skip;

    liveIt('getIMDBMovieInfo("Who Killed Cock Robin") should return the expected IMDB id', async function () {
      this.timeout(30000);
      const movieInfo = await getIMDBMovieInfo({ englishTitle: 'Who Killed Cock Robin', releaseDate: '2017-03-31' });
      movieInfo.should.have.property('imdbID', 'tt5576318');
      movieInfo.should.have.property('imdbRating').above(6);
    });

    liveIt('getIMDBRating should return a rating for a known IMDB id', async function () {
      this.timeout(30000);
      const rating = await getIMDBRating('tt12619256');
      rating.length.should.above(0);
    });
  });
});
