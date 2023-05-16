import { getPttPage } from '../crawler/pttCrawler';
import { Mongo } from '../data/db';
import * as Q from 'q';
import Article from '../models/article';
import PttPage from '../models/pttPage';

export async function updatePttArticles(howManyPagePerTime) {
  const range = await getCurrentCrawlRange(howManyPagePerTime);
  const pttPages = await getRangePttPages(range);
  updateMaxPttIndex(pttPages, range.startPttIndex);
  let pttArticles: Article[] = [].concat(
    ...pttPages.map(({ articles }) => articles)
  );
  await Promise.all(
    pttArticles.map((pttArticle) =>
      Mongo.updateDocument({ url: pttArticle.url }, pttArticle, 'pttArticles')
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
  const promises = [];
  for (let i = startPttIndex; i <= endPttIndex; i++) {
    const promise = getPttPage(i);
    promises.push(promise);
  }

  const results = await Q.allSettled(promises);
  let pttPages = [];
  results.forEach((result) => {
    if (result.state === 'fulfilled') {
      var value = result.value;
      pttPages.push(value);
    } else {
      var reason = result.reason;
      console.error(reason);
    }
  });
  return pttPages;
}

async function updateMaxPttIndex(pttPages, startPttIndex) {
  const pttIndexs = pttPages.map(({ pageIndex }) => pageIndex);
  const crawlerStatus = await Mongo.getDocument(crawlerStatusFilter, 'configs');
  const maxCrawledPttIndex = Math.max(...pttIndexs, startPttIndex);
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
