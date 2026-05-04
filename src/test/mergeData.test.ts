import { mergeData } from '../crawler/mergeData';
import { ObjectId } from 'mongodb';
import Movie from '../models/movie';

describe('mergeData', () => {
  it('should not merge if chineseTitle matches but article date is out of range', () => {
    const movieBases: Movie[] = [
      { _id: new ObjectId(), chineseTitle: '測試資料1', releaseDate: '2016-11-07' },
    ];
    const pttArticles = [
      {
        title: '[好雷] 測試資料1',
        url: 'https://www.ptt.cc/bbs/movie/M.1472305062.A.807.html',
        date: '2016/06/06',
      },
    ];
    const actual = mergeData(movieBases, pttArticles);
    expect(actual[0].relatedArticles).toEqual([]);
  });

  it('should merge if chineseTitle matches and article date is in range', () => {
    const movieBases: Movie[] = [
      { _id: new ObjectId(), chineseTitle: '測試', releaseDate: '2016-09-07' },
    ];
    const pttArticles = [
      {
        title: '[好雷] 測試資料',
        url: 'https://www.ptt.cc/bbs/movie/M.1472305062.A.807.html',
        date: '2016/08/07',
      },
    ];
    const actual = mergeData(movieBases, pttArticles);
    expect(actual[0].relatedArticles).toEqual(pttArticles);
  });
});
