import { ObjectId } from 'mongodb';
import { Mongo } from '../data/db';
import { COLLECTIONS } from '../data/collections';
import { linkPttArticlesForMovieBases, runMergeForMovieBaseIds } from '../task/mergeTask';

describe('incremental merge task', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('merges only requested movieBaseIds and their linked PTT articles', async () => {
    const touchedId = new ObjectId();
    const untouchedId = new ObjectId();
    const bulkOps: any[] = [];
    const finds: any[] = [];

    Mongo.db = {
      collection(name: string) {
        if (name === COLLECTIONS.movieBases) {
          return {
            find(query: any) {
              finds.push({ collection: name, query });
              return {
                toArray: async () => [
                  { _id: touchedId, chineseTitle: '測試片', releaseDate: '2026-06-01' },
                ],
              };
            },
          };
        }
        if (name === COLLECTIONS.pttArticles) {
          return {
            find(query: any, options: any) {
              finds.push({ collection: name, query, options });
              return {
                toArray: async () => [
                  { title: '[好雷] 測試片', date: '2026/06/02', movieBaseId: touchedId.toHexString() },
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
                    upsert() {
                      return {
                        updateOne(update: any) {
                          bulkOps.push({ filter, update });
                        },
                      };
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

    const merged = await runMergeForMovieBaseIds([
      touchedId.toHexString(),
      touchedId.toHexString(),
      untouchedId.toHexString(),
    ]);

    expect(merged).toHaveLength(1);
    expect(finds).toEqual([
      {
        collection: COLLECTIONS.movieBases,
        query: { _id: { $in: [touchedId, untouchedId] } },
      },
      {
        collection: COLLECTIONS.pttArticles,
        query: { movieBaseId: { $in: [touchedId.toHexString(), untouchedId.toHexString()] } },
        options: { projection: { _id: 0 } },
      },
    ]);
    expect(bulkOps).toHaveLength(1);
    expect(bulkOps[0].filter).toEqual({ movieBaseId: touchedId.toHexString() });
    expect(bulkOps[0].update.$set.relatedArticles).toHaveLength(1);
  });

  it('links old unmatched PTT articles for refreshed LINE movies', async () => {
    const movieId = new ObjectId();
    const updates: any[] = [];
    Mongo.db = {
      collection(name: string) {
        if (name !== COLLECTIONS.pttArticles) throw new Error(`Unexpected collection ${name}`);
        return {
          updateMany: async (query: any, update: any) => {
            updates.push({ query, update });
            return { modifiedCount: 2 };
          },
        };
      },
    } as any;

    const linked = await linkPttArticlesForMovieBases([
      { _id: movieId, chineseTitle: '測試.片', releaseDate: '2026-06-01' },
    ]);

    expect(linked).toBe(2);
    expect(updates).toEqual([
      {
        query: {
          title: { $regex: '測試\\.片' },
          date: { $gte: '2026/03/01', $lte: '2026/12/01' },
          $or: [
            { movieBaseId: { $exists: false } },
            { movieBaseId: null },
            { movieBaseId: '' },
          ],
        },
        update: { $set: { movieBaseId: movieId.toHexString() } },
      },
    ]);
  });
});
