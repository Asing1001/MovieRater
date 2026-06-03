import { findMovieBaseId, getLatestPttIndex, getPttPage } from '../crawler/pttCrawler';

describe('pttCrawler', () => {
  describe('findMovieBaseId', () => {
    const movieBases = [
      {
        _id: { toHexString: () => 'abc123' },
        chineseTitle: '羅根',
        englishTitle: 'Logan',
        releaseDate: '2017-02-28',
      },
      {
        _id: { toHexString: () => 'def456' },
        chineseTitle: 'chineseTitle',
        englishTitle: 'englishTitle',
        releaseDate: '2013-02-28',
      },
    ];

    it('should find the matching movieBaseId by chineseTitle within the release window', () => {
      expect(findMovieBaseId('[普雷] 羅根 (原來還蠻血腥的)', '2017/03/14', movieBases)).toBe('abc123');
    });
  });

  describe('getPttPage', () => {
    const liveIt = process.env.ENABLE_LIVE_CRAWLER_TESTS === 'true' ? it : it.skip;

    liveIt('should reject when pttIndex does not exist', async () => {
      const pageIndex = 99999;
      await expect(getPttPage(pageIndex)).rejects.toThrow(
        `index${pageIndex} not exist, server return:404 - Not Found.`
      );
    }, 5000);

    liveIt('should resolve when pttIndex exists', async () => {
      const pttPage = await getPttPage(4000);
      expect(pttPage.articles.length).toBeGreaterThan(0);
    }, 5000);
  });

  describe('getLatestPttIndex', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('detects latest index from the previous-page link on PTT latest page', async () => {
      vi.stubGlobal('fetch', vi.fn(async () => ({
        text: async () => `
          <div class="action-bar">
            <a class="btn wide" href="/bbs/movie/index1.html">最舊</a>
            <a class="btn wide" href="/bbs/movie/index11002.html">&lsaquo; 上頁</a>
            <a class="btn wide disabled">下頁 &rsaquo;</a>
          </div>
        `,
        status: 200,
        statusText: 'OK',
      })));

      await expect(getLatestPttIndex()).resolves.toBe(11003);
    });
  });
});
