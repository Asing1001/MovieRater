import { getPttPage, findMovieBaseId } from '../crawler/pttCrawler';
import { Mongo } from '../data/db';
import { ObjectId } from 'mongodb';
import Article from '../models/article';
import PttPage from '../models/pttPage';
import { COLLECTIONS } from '../data/collections';

export async function updatePttArticles(howManyPagePerTime) {
  const range = await getCurrentCrawlRange(howManyPagePerTime);
  const pttPages = await getRangePttPages(range);
  updateMaxPttIndex(pttPages, range.startPttIndex);
  const pttArticles: Article[] = ([] as Article[]).concat(
    ...pttPages.map(({ articles }) => articles)
  );
  const enriched = pttArticles.map((article) => ({
    ...article,
    movieBaseId: findMovieBaseId(article.title ?? '', article.date ?? ''),
  }));
  await Promise.all(
    enriched.map((article) =>
      Mongo.updateDocument({ url: article.url }, article, COLLECTIONS.pttArticles)
    )
  );

  // Aggregate counts from ALL pttArticles per movieBaseId and persist to DB
  const countAgg = await Mongo.db.collection(COLLECTIONS.pttArticles).aggregate([
    { $match: { movieBaseId: { $exists: true, $ne: null } } },
    { $group: {
      _id: '$movieBaseId',
      pttGoodCount: { $sum: { $cond: [{ $or: [
        { $gte: [{ $indexOfCP: ['$title', '好雷'] }, 0] },
        { $gte: [{ $indexOfCP: ['$title', '好無雷'] }, 0] },
      ] }, 1, 0] } },
      pttNormalCount: { $sum: { $cond: [{ $gte: [{ $indexOfCP: ['$title', '普雷'] }, 0] }, 1, 0] } },
      pttBadCount: { $sum: { $cond: [{ $gte: [{ $indexOfCP: ['$title', '負雷'] }, 0] }, 1, 0] } },
    } },
  ]).toArray();

  if (countAgg.length > 0) {
    const bulkY = Mongo.db.collection(COLLECTIONS.movieBases).initializeUnorderedBulkOp();
    const bulkM = Mongo.db.collection(COLLECTIONS.mergedDatas).initializeUnorderedBulkOp();
    for (const { _id, pttGoodCount, pttNormalCount, pttBadCount } of countAgg) {
      const counts = { pttGoodCount, pttNormalCount, pttBadCount };
      try { bulkY.find({ _id: new ObjectId(_id) }).updateOne({ $set: counts }); } catch {}
      bulkM.find({ movieBaseId: _id }).updateOne({ $set: counts });
    }
    await Promise.all([bulkY.execute(), bulkM.execute()]);
    console.log(`updatePttArticles: wrote counts for ${countAgg.length} movies`);
  }

  return countAgg;
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getCurrentCrawlRange(howManyPagePerTime) {
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, COLLECTIONS.configs);
  const startPttIndex = crawlerStatus.lastCrawlPttIndex + 1;
  return { startPttIndex, endPttIndex: startPttIndex + howManyPagePerTime - 1 };
}

async function getRangePttPages({ startPttIndex, endPttIndex }) {
  const pttPages: PttPage[] = [];
  for (let i = startPttIndex; i <= endPttIndex; i++) {
    try {
      const page = await getPttPage(i);
      pttPages.push(page);
    } catch (err) {
      console.error(err);
    }
  }
  return pttPages;
}

async function updateMaxPttIndex(pttPages: PttPage[], startPttIndex: number) {
  const pttIndexes = pttPages.map(({ pageIndex }) => pageIndex);
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, COLLECTIONS.configs);
  const maxCrawledPttIndex = Math.max(...pttIndexes, startPttIndex);
  const alreadyCrawlTheNewest = maxCrawledPttIndex === startPttIndex;
  if (alreadyCrawlTheNewest) {
    const lastCrawlPttIndex =
      maxCrawledPttIndex - 100 > 0 ? maxCrawledPttIndex - 100 : 0;
    Mongo.updateDocument(crawlerStatusFilter, { lastCrawlPttIndex }, COLLECTIONS.configs);
  } else {
    Mongo.updateDocument(
      crawlerStatusFilter,
      {
        maxPttIndex: Math.max(maxCrawledPttIndex, crawlerStatus.maxPttIndex),
        lastCrawlPttIndex: maxCrawledPttIndex,
      },
      COLLECTIONS.configs
    );
  }
  console.log(
    `new pttPages count:${pttPages.length}, lastCrawlPttIndex:${maxCrawledPttIndex}`
  );
}
