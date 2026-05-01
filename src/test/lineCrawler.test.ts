import { getPlayingMovies } from '../crawler/lineCrawler';

describe('lineCrawler', () => {
  describe('getPlayingMovies', () => {
    it('should fetch and return playing movies', async () => {
      const movieInfo = await getPlayingMovies();
      expect(typeof movieInfo).toBe('object');
      expect(typeof movieInfo.id).toBe('string');
      expect(typeof movieInfo.totalCount).toBe('number');
      expect(Array.isArray(movieInfo.items)).toBe(true);
      expect(movieInfo.items.length).toBeGreaterThan(0);
    }, 30000);
  });
});
