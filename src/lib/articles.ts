import moment from 'moment';
import { Mongo } from '../data/db';
import Article from '../models/article';
import { serialize } from './utils';

export async function getArticlesByMovieBaseId(movieBaseId: string): Promise<Article[]> {
  if (!movieBaseId) return [];
  await Mongo.openDbConnection();
  const nineMonthsAgo = moment().subtract(9, 'months').format('YYYY/MM/DD');
  const articles = await Mongo.db
    .collection<Article>('pttArticles')
    .find(
      { movieBaseId, date: { $gte: nineMonthsAgo } },
      { projection: { _id: 0 }, sort: { date: -1 } }
    )
    .toArray();
  return serialize(articles);
}
