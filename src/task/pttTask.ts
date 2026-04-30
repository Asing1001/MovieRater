import { getPttPage, findMovieBaseId } from '../crawler/pttCrawler';
import { Mongo } from '../data/db';
import Article from '../models/article';
import PttPage from '../models/pttPage';

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
      Mongo.updateDocument({ url: article.url }, article, 'pttArticles')
    )
  );
}

const crawlerStatusFilter = { name: 'crawlerStatus' };
async function getCurrentCrawlRange(howManyPagePerTime) {
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, 'configs');
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
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, 'configs');
  const maxCrawledPttIndex = Math.max(...pttIndexes, startPttIndex);
  const alreadyCrawlTheNewest = maxCrawledPttIndex === startPttIndex;
  if (alreadyCrawlTheNewest) {
    const lastCrawlPttIndex =
      maxCrawledPttIndex - 100 > 0 ? maxCrawledPttIndex - 100 : 0;
    Mongo.updateDocument(crawlerStatusFilter, { lastCrawlPttIndex }, 'configs');
  } else {
    Mongo.updateDocument(
      crawlerStatusFilter,
      {
        maxPttIndex: Math.max(maxCrawledPttIndex, crawlerStatus.maxPttIndex),
        lastCrawlPttIndex: maxCrawledPttIndex,
      },
      'configs'
    );
  }
  console.log(
    `new pttPages count:${pttPages.length}, lastCrawlPttIndex:${maxCrawledPttIndex}`
  );
}
