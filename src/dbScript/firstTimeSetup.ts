import { Db } from 'mongodb';
import {
  updateTheaterWithLocationList,
  updateYahooMovies,
} from '../task/yahooTask';
import { Mongo } from '../data/db';
import { updatePttArticles } from '../task/pttTask';

setup();

let db: Db;
const NEWEST_FETCH_COUNT = 500;
const BATCH_SIZE = 50;
//It Will not override any exist collection, document and index, so don't be afraid if accidently excute it.
async function setup() {
  const connection = await Mongo.openDbConnection();
  db = connection.db();
  await ensureCollectionAndIndex();
  await ensureCrawlerStatus();
  await updateTheaterWithLocationList();
  for (let i = 0; i < NEWEST_FETCH_COUNT / BATCH_SIZE; i++) {
    await updateYahooMovies(BATCH_SIZE);
    await updatePttArticles(BATCH_SIZE);
  }
  console.log('db setup done');
  process.exit();
}

async function ensureCollectionAndIndex() {
  //It will
  //1. create collection if collection not exist
  //2. create index if index not exist
  await db.collection('yahooMovies').createIndex({ yahooId: -1 });
  await db.collection('pttArticles').createIndex({ url: -1 });
  await db.collection('theaters').createIndex({ regionIndex: 1 });
  await db.collection('theaters').createIndex({ name: 1 });
}

async function ensureCrawlerStatus() {
  const res = await fetch(
    `https://www.mvrater.com/api/crawlerstatus?${Date.now()}`
  );
  const crawlerStatus = await res.json();
  const { maxYahooId, maxPttIndex } = crawlerStatus;
  const defaultCrawlerStatus = {
    name: 'crawlerStatus',
    maxYahooId,
    maxPttIndex,
    lastCrawlYahooId: maxYahooId - NEWEST_FETCH_COUNT,
    lastCrawlPttIndex: maxPttIndex - NEWEST_FETCH_COUNT,
    scheduleDay: undefined,
  };
  await db
    .collection('configs')
    .updateOne(
      { name: defaultCrawlerStatus.name },
      { $set: defaultCrawlerStatus },
      { upsert: true }
    );
}
