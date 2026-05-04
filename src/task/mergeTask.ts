import { Mongo } from '../data/db';
import { mergeData } from '../crawler/mergeData';
import Article from '../models/article';
import MovieBase from '../models/movieBase';
import { COLLECTIONS } from '../data/collections';

export async function runMerge() {
  const [movieBases, pttArticles] = await Promise.all([
    Mongo.getCollection<MovieBase>({ name: COLLECTIONS.movieBases }),
    Mongo.getCollection<Article>({ name: COLLECTIONS.pttArticles, options: { projection: { _id: 0 } } }),
  ]);
  const merged = mergeData(movieBases, pttArticles);
  console.log(`runMerge: ${merged.length} movies`);

  const batchSize = 100;
  for (let i = 0; i < merged.length; i += batchSize) {
    const bulk = Mongo.db.collection(COLLECTIONS.mergedDatas).initializeUnorderedBulkOp();
    merged.slice(i, i + batchSize).forEach(({ _id, ...data }) => {
      bulk.find({ movieBaseId: data.movieBaseId }).upsert().updateOne({ $set: data });
    });
    await bulk.execute();
  }

  console.log('runMerge: done');
  return merged;
}
