import { MongoClient, Db } from 'mongodb';
import { updateTheaterWithLocationList } from '../task/yahooTask';
import { Mongo } from '../data/db';

setup();

let db: Db;

//It Will not override any exist collection, document and index, so don't be afraid if accidently excute it.
async function setup() {
  const connection = await Mongo.openDbConnection();
  db = connection.db();
  await ensureCollectionAndIndex();
  await ensureCrawlerStatus();
  await updateTheaterWithLocationList();
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
  const defaultCrawlerStatus = {
    name: 'crawlerStatus',
    maxYahooId: 1,
    maxPttIndex: 1,
  };
  const isCrawlerStatusExist = await db
    .collection('configs')
    .count({ name: defaultCrawlerStatus.name });
  isCrawlerStatusExist ||
    (await db.collection('configs').insertOne(defaultCrawlerStatus));
}
