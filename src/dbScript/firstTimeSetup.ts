import { MongoClient, Db } from 'mongodb';
import { systemSetting } from '../configs/systemSetting';

setup()

let db: Db;

//It Will not override any exist collection, document and index, so don't be afraid if accidently excute it.
async function setup() {
    db = await MongoClient.connect(systemSetting.dbUrl);
    await ensureCollectionAndIndex();
    await ensureCrawlerStatus();
    console.log('db setup done');
}

async function ensureCollectionAndIndex() {
    //It will 
    //1. create collection if collection not exist
    //2. create index if index not exist
    await db.collection('yahooMovies').createIndex({ "yahooId": -1 })
    await db.collection('pttArticles').createIndex({ "url": -1 })
}

async function ensureCrawlerStatus() {
    const defaultCrawlerStatus = {
        name: "crawlerStatus",
        maxYahooId: 1,
        maxPttIndex: 1
    }
    const isCrawlerStatusExist = await db.collection("configs").count({name:defaultCrawlerStatus.name})
    isCrawlerStatusExist || await db.collection("configs").insert(defaultCrawlerStatus)
}