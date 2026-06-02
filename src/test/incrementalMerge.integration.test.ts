import { MongoClient, ObjectId } from 'mongodb';
import { Mongo } from '../data/db';
import { COLLECTIONS } from '../data/collections';
import { linkPttArticlesForMovieBases, runMergeForMovieBaseIds } from '../task/mergeTask';
import { updatePttArticles } from '../task/pttTask';

vi.mock('../crawler/pttCrawler', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../crawler/pttCrawler')>();
  return {
    ...actual,
    getPttPage: vi.fn(async (index: number) => ({
      pageIndex: index,
      url: `https://www.ptt.cc/bbs/movie/index${index}.html`,
      articles: [
        { title: '[好雷] 新文章電影', url: `https://example.test/${index}-good`, date: '2026/06/03' },
        { title: '[閒聊] 不相關文章', url: `https://example.test/${index}-chat`, date: '2026/06/03' },
      ],
    })),
  };
});

const integrationIt = process.env.INTEGRATION_MONGO_URL ? it : it.skip;

describe('incremental merge integration', () => {
  let client: MongoClient;

  beforeAll(async () => {
    if (!process.env.INTEGRATION_MONGO_URL) return;
    client = new MongoClient(process.env.INTEGRATION_MONGO_URL);
    await client.connect();
    Mongo.dbConnection = client;
    Mongo.db = client.db();
  });

  afterAll(async () => {
    if (!client) return;
    await Mongo.db.dropDatabase();
    await client.close();
    Mongo.dbConnection = null;
    Mongo.db = null;
  });

  beforeEach(async () => {
    if (!process.env.INTEGRATION_MONGO_URL) return;
    await Mongo.db.dropDatabase();
  });

  integrationIt('links old articles, updates touched PTT counts, and merges only touched movies', async () => {
    const oldArticleMovieId = new ObjectId();
    const newArticleMovieId = new ObjectId();

    await Mongo.db.collection(COLLECTIONS.configs).insertOne({
      name: 'crawlerStatus',
      lastCrawlPttIndex: 10,
      maxPttIndex: 10,
    });
    await Mongo.db.collection(COLLECTIONS.movieBases).insertMany([
      {
        _id: oldArticleMovieId,
        chineseTitle: '舊文章電影',
        englishTitle: 'Old Article Movie',
        releaseDate: '2026-06-01',
        lineMovieId: 'old-line-id',
      },
      {
        _id: newArticleMovieId,
        chineseTitle: '新文章電影',
        englishTitle: 'New Article Movie',
        releaseDate: '2026-06-01',
        lineMovieId: 'new-line-id',
      },
    ]);
    await Mongo.db.collection(COLLECTIONS.pttArticles).insertMany([
      {
        title: '[好雷] 舊文章電影',
        url: 'https://example.test/old-good',
        date: '2026/06/02',
      },
      {
        title: '[好雷] 其他電影',
        url: 'https://example.test/other-good',
        date: '2026/06/02',
      },
    ]);

    const linked = await linkPttArticlesForMovieBases([
      {
        _id: oldArticleMovieId,
        chineseTitle: '舊文章電影',
        releaseDate: '2026-06-01',
      },
    ]);
    expect(linked).toBe(1);

    const oldArticle = await Mongo.db.collection(COLLECTIONS.pttArticles).findOne({ url: 'https://example.test/old-good' });
    const unrelatedArticle = await Mongo.db.collection(COLLECTIONS.pttArticles).findOne({ url: 'https://example.test/other-good' });
    expect(oldArticle?.movieBaseId).toBe(oldArticleMovieId.toHexString());
    expect(unrelatedArticle?.movieBaseId).toBeUndefined();

    const oldMerged = await runMergeForMovieBaseIds([oldArticleMovieId.toHexString()]);
    expect(oldMerged).toHaveLength(1);
    const oldMergedDoc = await Mongo.db.collection(COLLECTIONS.mergedDatas).findOne({ movieBaseId: oldArticleMovieId.toHexString() });
    expect(oldMergedDoc?.relatedArticles).toHaveLength(1);
    expect(await Mongo.db.collection(COLLECTIONS.mergedDatas).findOne({ movieBaseId: newArticleMovieId.toHexString() })).toBeNull();

    const pttUpdate = await updatePttArticles(2);
    expect(pttUpdate.articleCount).toBe(4);
    expect(pttUpdate.movieBaseIds).toEqual([newArticleMovieId.toHexString()]);
    expect(pttUpdate.counts).toEqual([
      {
        _id: newArticleMovieId.toHexString(),
        pttGoodCount: 2,
        pttNormalCount: 0,
        pttBadCount: 0,
      },
    ]);

    const status = await Mongo.db.collection(COLLECTIONS.configs).findOne({ name: 'crawlerStatus' });
    expect(status?.lastCrawlPttIndex).toBe(12);
    expect(status?.maxPttIndex).toBe(12);

    const movieBaseAfterPtt = await Mongo.db.collection(COLLECTIONS.movieBases).findOne({ _id: newArticleMovieId });
    expect(movieBaseAfterPtt?.pttGoodCount).toBe(2);

    const newMerged = await runMergeForMovieBaseIds(pttUpdate.movieBaseIds);
    expect(newMerged).toHaveLength(1);
    const newMergedDoc = await Mongo.db.collection(COLLECTIONS.mergedDatas).findOne({ movieBaseId: newArticleMovieId.toHexString() });
    expect(newMergedDoc?.relatedArticles).toHaveLength(2);
    expect(newMergedDoc?.pttGoodCount).toBe(2);
  });
});
