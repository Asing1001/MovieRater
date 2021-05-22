import { mergeData } from '../crawler/mergeData';
import { db } from "../data/db";

const main = async () => {
  await db.openDbConnection()
  const yahooMoviesPromise = db.getCollection({ name: "yahooMovies", sort: { yahooId: -1 } });
  const pttArticlesPromise = db.getCollection({ name: "pttArticles" });
  console.time('get yahooMovies and pttArticles');
  const [yahooMovies, pttArticles] = await Promise.all([yahooMoviesPromise, pttArticlesPromise]);
  console.timeEnd('get yahooMovies and pttArticles');
  console.time('mergeData');
  const mergedDatas = mergeData(yahooMovies, pttArticles)
  console.timeEnd('mergeData');
  console.log('mergedDatas.length', mergedDatas.length);
  console.time('Insert mergedDatas');
  const batchSize = 100
  for (let batchIndex = 0; batchIndex < mergedDatas.length / batchSize; batchIndex++) {
    console.time(`Insert mergedDatas batch ${batchIndex}`);
    const bulk = db.dbConnection.collection('mergedDatas').initializeUnorderedBulkOp()
    const start = batchIndex * batchSize
    const end = start + batchSize
    mergedDatas.slice(start, end).forEach(data => {
      bulk.find({ yahooId: data.yahooId }).upsert().updateOne(data)
    });
    await bulk.execute()
    console.timeEnd(`Insert mergedDatas batch ${batchIndex}`);
  }
  console.timeEnd('Insert mergedDatas');
  process.exit()
}

main()