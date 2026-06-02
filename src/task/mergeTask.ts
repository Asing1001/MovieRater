import { Mongo } from '../data/db';
import { mergeData } from '../crawler/mergeData';
import Article from '../models/article';
import MovieBase from '../models/movieBase';
import { COLLECTIONS } from '../data/collections';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import isValideDate from '../helper/isValideDate';

export async function runMerge() {
  const [movieBases, pttArticles] = await Promise.all([
    Mongo.getCollection<MovieBase>({ name: COLLECTIONS.movieBases }),
    Mongo.getCollection<Article>({ name: COLLECTIONS.pttArticles, options: { projection: { _id: 0 } } }),
  ]);
  return upsertMergedMovies(movieBases, pttArticles, 'runMerge');
}

export async function runMergeForMovieBases(movieBases: MovieBase[]) {
  const movieBaseIds = movieBases.map((movie) => movie._id?.toHexString?.()).filter(Boolean);
  return runMergeForMovieBaseIds(movieBaseIds);
}

export async function runMergeForMovieBaseIds(movieBaseIds: string[]) {
  const uniqueIds = [...new Set(movieBaseIds.filter(Boolean))];
  if (!uniqueIds.length) {
    console.log('runMergeForMovieBaseIds: 0 movies');
    return [];
  }

  const objectIds = uniqueIds
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));
  const [movieBases, pttArticles] = await Promise.all([
    Mongo.db
      .collection<MovieBase>(COLLECTIONS.movieBases)
      .find({ _id: { $in: objectIds } } as any)
      .toArray(),
    Mongo.db
      .collection<Article>(COLLECTIONS.pttArticles)
      .find({ movieBaseId: { $in: uniqueIds } }, { projection: { _id: 0 } })
      .toArray(),
  ]);

  return upsertMergedMovies(movieBases, pttArticles, 'runMergeForMovieBaseIds');
}

export async function linkPttArticlesForMovieBases(movieBases: MovieBase[]) {
  let matchedArticles = 0;
  for (const movie of movieBases) {
    const movieBaseId = movie._id?.toHexString?.();
    if (!movieBaseId || !movie.chineseTitle || movie.chineseTitle.length < 2) continue;

    const releaseDate = isValideDate(movie.releaseDate) ? moment(movie.releaseDate) : moment();
    const rangeStart = releaseDate.clone().subtract(3, 'months').format('YYYY/MM/DD');
    const rangeEnd = releaseDate.clone().add(6, 'months').format('YYYY/MM/DD');
    const result = await Mongo.db.collection(COLLECTIONS.pttArticles).updateMany(
      {
        title: { $regex: escapeRegExp(movie.chineseTitle) },
        date: { $gte: rangeStart, $lte: rangeEnd },
        $or: [
          { movieBaseId: { $exists: false } },
          { movieBaseId: null },
          { movieBaseId: '' },
        ],
      },
      { $set: { movieBaseId } }
    );
    matchedArticles += result.modifiedCount;
  }
  console.log(`linkPttArticlesForMovieBases: linked ${matchedArticles} articles`);
  return matchedArticles;
}

async function upsertMergedMovies(movieBases: MovieBase[], pttArticles: Article[], label: string) {
  const merged = mergeData(movieBases, pttArticles);
  console.log(`${label}: ${merged.length} movies`);

  if (!merged.length) {
    return merged;
  }

  const batchSize = 100;
  for (let i = 0; i < merged.length; i += batchSize) {
    const bulk = Mongo.db.collection(COLLECTIONS.mergedDatas).initializeUnorderedBulkOp();
    merged.slice(i, i + batchSize).forEach(({ _id, ...data }) => {
      bulk.find({ movieBaseId: data.movieBaseId }).upsert().updateOne({ $set: data });
    });
    await bulk.execute();
  }

  console.log(`${label}: done`);
  return merged;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
