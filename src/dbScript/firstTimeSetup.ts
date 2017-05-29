import { MongoClient, Db } from 'mongodb';
import { updateTheaterWithLocationList } from '../task/yahooTask';
import { db } from '../data/db';


setup()

let dbConnection:Db;

//It Will not override any exist collection, document and index, so don't be afraid if accidently excute it.
async function setup() {
    dbConnection = await db.openDbConnection();
    await ensureCollectionAndIndex();
    await ensureCrawlerStatus();
    await updateTheaterWithLocationList();
    console.log('db setup done');
}

async function ensureCollectionAndIndex() {
    //It will 
    //1. create collection if collection not exist
    //2. create index if index not exist
    await dbConnection.collection('yahooMovies').createIndex({ "yahooId": -1 })
    await dbConnection.collection('pttArticles').createIndex({ "url": -1 })
    await dbConnection.collection('theaters').createIndex({ "regionIndex": 1 })
    await dbConnection.collection('theaters').createIndex({ "name": 1 })
}

async function ensureCrawlerStatus() {
    const defaultCrawlerStatus = {
        name: "crawlerStatus",
        maxYahooId: 1,
        maxPttIndex: 1
    }
    const isCrawlerStatusExist = await dbConnection.collection("configs").count({ name: defaultCrawlerStatus.name })
    isCrawlerStatusExist || await dbConnection.collection("configs").insert(defaultCrawlerStatus)
}