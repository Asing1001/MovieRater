import { mergeData } from '../crawler/mergeData';
import { Mongo } from '../data/db';
import Article from '../models/article';
import MovieBase from '../models/movieBase';

const main = async () => {
  await Mongo.openDbConnection();
  const yahooMoviesPromise = Mongo.getCollection<MovieBase>({
    name: 'yahooMovies',
  });
  const pttArticlesPromise = Mongo.getCollection<Article>({
    name: 'pttArticles',
    options: { projection: { _id: 0 } },
  });
  console.time('get yahooMovies and pttArticles');
  const [yahooMovies, pttArticles] = await Promise.all([yahooMoviesPromise, pttArticlesPromise]);
  console.timeEnd('get yahooMovies and pttArticles');
  console.time('mergeData');
  const mergedDatas = mergeData(yahooMovies, pttArticles);
  console.timeEnd('mergeData');
  console.log('mergedDatas.length', mergedDatas.length);
  console.time('Insert mergedDatas');
  const batchSize = 100;
  for (let batchIndex = 0; batchIndex < mergedDatas.length / batchSize; batchIndex++) {
    console.time(`Insert mergedDatas batch ${batchIndex}`);
    const bulk = Mongo.db.collection('mergedDatas').initializeUnorderedBulkOp();
    const start = batchIndex * batchSize;
    const end = start + batchSize;
    mergedDatas.slice(start, end).forEach(({ _id, ...data }) => {
      bulk.find({ movieBaseId: data.movieBaseId }).upsert().updateOne({ $set: data });
    });
    await bulk.execute();
    console.timeEnd(`Insert mergedDatas batch ${batchIndex}`);
  }
  console.timeEnd('Insert mergedDatas');
  process.exit();
};

main();
