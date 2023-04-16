import { mergeData } from '../crawler/mergeData';
import { Mongo } from '../data/db';
import Article from '../models/article';
import YahooMovie from '../models/yahooMovie';

const main = async () => {
  await Mongo.openDbConnection();
  const yahooMoviesPromise = Mongo.getCollection<YahooMovie>({
    name: 'yahooMovies',
    sort: { yahooId: -1 },
  });
  const pttArticlesPromise = Mongo.getCollection<Article>({
    name: 'pttArticles',
  });
  console.time('get yahooMovies and pttArticles');
  const [yahooMovies, pttArticles] = await Promise.all([
    yahooMoviesPromise,
    pttArticlesPromise,
  ]);
  console.timeEnd('get yahooMovies and pttArticles');
  console.time('mergeData');
  const mergedDatas = mergeData(yahooMovies, pttArticles);
  console.timeEnd('mergeData');
  console.log('mergedDatas.length', mergedDatas.length);
  console.time('Insert mergedDatas');
  const batchSize = 100;
  for (
    let batchIndex = 0;
    batchIndex < mergedDatas.length / batchSize;
    batchIndex++
  ) {
    console.time(`Insert mergedDatas batch ${batchIndex}`);
    const bulk = Mongo.db.collection('mergedDatas').initializeUnorderedBulkOp();
    const start = batchIndex * batchSize;
    const end = start + batchSize;
    mergedDatas.slice(start, end).forEach((data) => {
      bulk.find({ yahooId: data.yahooId }).upsert().updateOne(data);
    });
    await bulk.execute();
    console.timeEnd(`Insert mergedDatas batch ${batchIndex}`);
  }
  console.timeEnd('Insert mergedDatas');
  process.exit();
};

main();
