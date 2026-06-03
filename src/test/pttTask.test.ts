import { ObjectId } from 'mongodb';
import { Mongo } from '../data/db';
import { COLLECTIONS } from '../data/collections';

const ids = vi.hoisted(() => ({
  touchedMovieBaseId: '64b7f8f2a7e6a6d7f8c9b001',
  latestPttIndex: 11,
}));

vi.mock('../crawler/pttCrawler', () => ({
  getPttPage: vi.fn(async (index: number) => ({
    pageIndex: index,
    url: `https://www.ptt.cc/bbs/movie/index${index}.html`,
    articles: [
      { title: '[好雷] 測試片', url: `https://example.test/${index}`, date: '2026/06/02' },
      { title: '[閒聊] 不相關', url: `https://example.test/${index}-x`, date: '2026/06/02' },
    ],
  })),
  getLatestPttIndex: vi.fn(async () => ids.latestPttIndex),
  findMovieBaseId: vi.fn((title: string) => title.includes('測試片') ? ids.touchedMovieBaseId : null),
}));

describe('pttTask incremental update', () => {
  afterEach(() => {
    ids.latestPttIndex = 11;
    vi.clearAllMocks();
  });

  it('returns touched movieBaseIds and aggregates counts only for touched movies', async () => {
    const updateDocuments: any[] = [];
    const aggregatePipelines: any[] = [];
    const movieBaseBulkUpdates: any[] = [];
    const mergedBulkUpdates: any[] = [];

    (Mongo as any).getDocument = vi.fn(async () => ({
      lastCrawlPttIndex: 10,
      maxPttIndex: 10,
    }));
    (Mongo as any).updateDocument = vi.fn(async (filter: any, value: any, collectionName: string) => {
      updateDocuments.push({ filter, value, collectionName });
      return {};
    });
    Mongo.db = {
      collection(name: string) {
        if (name === COLLECTIONS.movieBases) {
          return {
            find() {
              return {
                project() {
                  return {
                    toArray: async () => [
                      { _id: new ObjectId(), chineseTitle: '測試片', releaseDate: '2026-06-01' },
                    ],
                  };
                },
              };
            },
            initializeUnorderedBulkOp() {
              return {
                find(filter: any) {
                  return {
                    updateOne(update: any) {
                      movieBaseBulkUpdates.push({ filter, update });
                    },
                  };
                },
                execute: async () => ({}),
              };
            },
          };
        }
        if (name === COLLECTIONS.pttArticles) {
          return {
            aggregate(pipeline: any[]) {
              aggregatePipelines.push(pipeline);
              return {
                toArray: async () => [
                  { _id: ids.touchedMovieBaseId, pttGoodCount: 1, pttNormalCount: 0, pttBadCount: 0 },
                ],
              };
            },
          };
        }
        if (name === COLLECTIONS.mergedDatas) {
          return {
            initializeUnorderedBulkOp() {
              return {
                find(filter: any) {
                  return {
                    updateOne(update: any) {
                      mergedBulkUpdates.push({ filter, update });
                    },
                  };
                },
                execute: async () => ({}),
              };
            },
          };
        }
        throw new Error(`Unexpected collection ${name}`);
      },
    } as any;

    const { updatePttArticles } = await import('../task/pttTask');
    const result = await updatePttArticles(1);

    expect(result).toEqual({
      counts: [{ _id: ids.touchedMovieBaseId, pttGoodCount: 1, pttNormalCount: 0, pttBadCount: 0 }],
      movieBaseIds: [ids.touchedMovieBaseId],
      articleCount: 2,
    });
    expect(aggregatePipelines[0][0]).toEqual({ $match: { movieBaseId: { $in: [ids.touchedMovieBaseId] } } });
    expect(updateDocuments.filter((op) => op.collectionName === COLLECTIONS.pttArticles)).toHaveLength(2);
    expect(movieBaseBulkUpdates).toHaveLength(1);
    expect(mergedBulkUpdates).toHaveLength(1);
  });

  it('clamps the crawl range to the latest PTT page', async () => {
    ids.latestPttIndex = 11003;
    const updateDocuments: any[] = [];

    (Mongo as any).getDocument = vi.fn(async () => ({
      lastCrawlPttIndex: 11002,
      maxPttIndex: 11005,
    }));
    (Mongo as any).updateDocument = vi.fn(async (filter: any, value: any, collectionName: string) => {
      updateDocuments.push({ filter, value, collectionName });
      return {};
    });
    Mongo.db = {
      collection(name: string) {
        if (name === COLLECTIONS.movieBases) {
          return {
            find() {
              return {
                project() {
                  return {
                    toArray: async () => [
                      { _id: new ObjectId(), chineseTitle: '測試片', releaseDate: '2026-06-01' },
                    ],
                  };
                },
              };
            },
            initializeUnorderedBulkOp() {
              return {
                find() {
                  return { updateOne() {} };
                },
                execute: async () => ({}),
              };
            },
          };
        }
        if (name === COLLECTIONS.pttArticles) {
          return {
            aggregate() {
              return {
                toArray: async () => [
                  { _id: ids.touchedMovieBaseId, pttGoodCount: 1, pttNormalCount: 0, pttBadCount: 0 },
                ],
              };
            },
          };
        }
        if (name === COLLECTIONS.mergedDatas) {
          return {
            initializeUnorderedBulkOp() {
              return {
                find() {
                  return { updateOne() {} };
                },
                execute: async () => ({}),
              };
            },
          };
        }
        throw new Error(`Unexpected collection ${name}`);
      },
    } as any;

    const pttCrawler = await import('../crawler/pttCrawler');
    const { updatePttArticles } = await import('../task/pttTask');
    await updatePttArticles(5);

    expect(pttCrawler.getPttPage).toHaveBeenCalledTimes(1);
    expect(pttCrawler.getPttPage).toHaveBeenCalledWith(11003);
    expect(updateDocuments).toContainEqual({
      filter: { name: 'crawlerStatus' },
      value: { maxPttIndex: 11003, lastCrawlPttIndex: 11003 },
      collectionName: COLLECTIONS.configs,
    });
  });

  it('does not crawl or roll back when already at the latest PTT page', async () => {
    ids.latestPttIndex = 11003;
    const updateDocuments: any[] = [];

    (Mongo as any).getDocument = vi.fn(async () => ({
      lastCrawlPttIndex: 11003,
      maxPttIndex: 11005,
    }));
    (Mongo as any).updateDocument = vi.fn(async (filter: any, value: any, collectionName: string) => {
      updateDocuments.push({ filter, value, collectionName });
      return {};
    });

    const pttCrawler = await import('../crawler/pttCrawler');
    const { updatePttArticles } = await import('../task/pttTask');
    const result = await updatePttArticles(5);

    expect(result).toEqual({ counts: [], movieBaseIds: [], articleCount: 0 });
    expect(pttCrawler.getPttPage).not.toHaveBeenCalled();
    expect(updateDocuments).toEqual([
      {
        filter: { name: 'crawlerStatus' },
        value: { maxPttIndex: 11003, lastCrawlPttIndex: 11003 },
        collectionName: COLLECTIONS.configs,
      },
    ]);
  });
});
