import { Mongo } from '../data/db';
import { mergeData } from '../crawler/mergeData';
import Article from '../models/article';
import MovieBase from '../models/movieBase';

export async function runMerge() {
  const [yahooMovies, pttArticles] = await Promise.all([
    Mongo.getCollection<MovieBase>({ name: 'yahooMovies' }),
    Mongo.getCollection<Article>({ name: 'pttArticles', options: { projection: { _id: 0 } } }),
  ]);
  const merged = mergeData(yahooMovies, pttArticles);
  console.log(`runMerge: ${merged.length} movies`);

  const batchSize = 100;
  for (let i = 0; i < merged.length; i += batchSize) {
    const bulk = Mongo.db.collection('mergedDatas').initializeUnorderedBulkOp();
    merged.slice(i, i + batchSize).forEach(({ _id, ...data }) => {
      bulk.find({ movieBaseId: data.movieBaseId }).upsert().updateOne({ $set: data });
    });
    await bulk.execute();
  }

  console.log('runMerge: done');
  return merged;
}
