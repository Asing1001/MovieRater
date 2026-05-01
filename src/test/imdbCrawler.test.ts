import {
  getIMDBMovieInfo,
  getIMDBRating,
  getIMDBSuggestIdFromSuggestions,
} from '../crawler/imdbCrawler';

describe('imdbCrawler', () => {
  describe('getIMDBSuggestIdFromSuggestions', () => {
    it('should match a close title when similarity is high', () => {
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
      expect(imdbID).toBe('tt5576318');
    });

    it('should use release year to disambiguate less similar titles', () => {
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
      expect(imdbID).toBe('tt5323662');
    });

    it('should return null when suggestions do not match', () => {
      const imdbID = getIMDBSuggestIdFromSuggestions(
        {
          d: [{ id: 'tt0000001', l: 'A Completely Different Movie', y: 2020 }],
        },
        'Girl Revenge',
        '2020-08-07'
      );
      expect(imdbID).toBeNull();
    });
  });

  describe('live IMDB integration', () => {
    const liveIt = process.env.ENABLE_LIVE_CRAWLER_TESTS === 'true' ? it : it.skip;

    liveIt('getIMDBMovieInfo("Who Killed Cock Robin") should return the expected IMDB id', async () => {
      const movieInfo = await getIMDBMovieInfo({
        englishTitle: 'Who Killed Cock Robin',
        releaseDate: '2017-03-31',
      });
      expect(movieInfo).toHaveProperty('imdbID', 'tt5576318');
      expect(Number(movieInfo.imdbRating)).toBeGreaterThan(6);
    }, 30000);

    liveIt('getIMDBRating should return a rating for a known IMDB id', async () => {
      const rating = await getIMDBRating('tt12619256');
      expect(rating.length).toBeGreaterThan(0);
    }, 30000);
  });
});
