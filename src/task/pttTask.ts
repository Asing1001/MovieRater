import { getPttPage, findMovieBaseId, getLatestPttIndex } from '../crawler/pttCrawler';
import { Mongo } from '../data/db';
import { ObjectId } from 'mongodb';
import Article from '../models/article';
import MovieBase from '../models/movieBase';
import PttPage from '../models/pttPage';
import { COLLECTIONS } from '../data/collections';

export interface PttUpdateResult {
  counts: PttCount[];
  movieBaseIds: string[];
  articleCount: number;
}

interface PttCount {
  _id: string;
  pttGoodCount: number;
  pttNormalCount: number;
  pttBadCount: number;
}

export async function updatePttArticles(howManyPagePerTime) {
  const range = await getCurrentCrawlRange(howManyPagePerTime);
  if (range.startPttIndex > range.endPttIndex) {
    await updatePttCrawlerStatus(range.latestPttIndex, range.latestPttIndex);
    console.log(`new pttPages count:0, lastCrawlPttIndex:${range.latestPttIndex}`);
    return { counts: [], movieBaseIds: [], articleCount: 0 } satisfies PttUpdateResult;
  }

  const pttPages = await getRangePttPages(range);
  await updateMaxPttIndex(pttPages, range.latestPttIndex);
  const pttArticles: Article[] = ([] as Article[]).concat(
    ...pttPages.map(({ articles }) => articles)
  );
  const movieBases = await Mongo.db
    .collection<MovieBase>(COLLECTIONS.movieBases)
    .find({
      chineseTitle: { $exists: true, $ne: null },
      releaseDate: { $exists: true, $ne: null },
    })
    .project({ _id: 1, chineseTitle: 1, releaseDate: 1 })
    .toArray();
  const enriched = pttArticles.map((article) => ({
    ...article,
    movieBaseId: findMovieBaseId(article.title ?? '', article.date ?? '', movieBases),
  }));
  await Promise.all(
    enriched.map((article) =>
      Mongo.updateDocument({ url: article.url }, article, COLLECTIONS.pttArticles)
    )
  );
  const movieBaseIds = [...new Set(enriched.map((article) => article.movieBaseId).filter((id): id is string => Boolean(id)))];

  if (!movieBaseIds.length) {
    return { counts: [], movieBaseIds: [], articleCount: enriched.length } satisfies PttUpdateResult;
  }

  // Aggregate counts only for movies touched by this crawl and persist to DB.
  const countAgg = await Mongo.db.collection(COLLECTIONS.pttArticles).aggregate<PttCount>([
    { $match: { movieBaseId: { $in: movieBaseIds } } },
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

  return { counts: countAgg, movieBaseIds, articleCount: enriched.length } satisfies PttUpdateResult;
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getCurrentCrawlRange(howManyPagePerTime) {
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, COLLECTIONS.configs);
  const latestPttIndex = await getLatestPttIndex();
  const startPttIndex = crawlerStatus.lastCrawlPttIndex + 1;
  const endPttIndex = Math.min(startPttIndex + howManyPagePerTime - 1, latestPttIndex);
  return { startPttIndex, endPttIndex, latestPttIndex };
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

async function updateMaxPttIndex(pttPages: PttPage[], latestPttIndex: number) {
  const pttIndexes = pttPages.map(({ pageIndex }) => pageIndex);
  if (!pttIndexes.length) {
    const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, COLLECTIONS.configs);
    await updatePttCrawlerStatus(crawlerStatus.lastCrawlPttIndex, latestPttIndex);
    console.log(`new pttPages count:0, lastCrawlPttIndex:${crawlerStatus.lastCrawlPttIndex}`);
    return;
  }

  const maxCrawledPttIndex = Math.max(...pttIndexes);
  await updatePttCrawlerStatus(maxCrawledPttIndex, latestPttIndex);
  console.log(
    `new pttPages count:${pttPages.length}, lastCrawlPttIndex:${maxCrawledPttIndex}`
  );
}

async function updatePttCrawlerStatus(lastCrawlPttIndex: number, maxPttIndex: number) {
  await Mongo.updateDocument(
    crawlerStatusFilter,
    { maxPttIndex, lastCrawlPttIndex },
    COLLECTIONS.configs
  );
}
