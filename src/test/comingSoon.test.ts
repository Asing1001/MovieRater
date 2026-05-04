import { describe, expect, it } from 'vitest';
import { groupComingSoonMoviesByMonth, mapLineComingSoonMovie } from '@/lib/comingSoonMovies';
import type { LINEMovieItem } from '@/crawler/lineCrawler';

function lineItem(overrides: Partial<LINEMovieItem> = {}): LINEMovieItem {
  return {
    id: 'line-id-1',
    title: '太空超人',
    thumbnail: { type: 'IMAGE', hash: 'poster-hash' },
    url: { hash: 'movie-hash' },
    movieId: '54581',
    movieGroupId: 'group-1',
    engTitle: 'MASTERS OF THE UNIVERSE',
    broadcastStatus: 'COMING_SOON',
    certificate: 'UNKNOWN',
    releaseDate: Date.UTC(2026, 5, 2, 16),
    rating: null,
    genres: ['冒險', '動作', '家庭'],
    runtime: 0,
    showtimeCount: 0,
    directors: ['崔維斯奈特'],
    cast: ['尼可拉斯葛拉辛'],
    latestTrailer: { hash: 'latest-trailer-hash' },
    mainTrailer: {
      id: 'trailer-id',
      title: '太空超人 國際版預告',
      publisher: '時報資訊',
      publisherId: '100622',
      publishTimeUnix: 1777098607000,
      contentType: 'TRAILER',
      thumbnail: { type: 'VIDEO', hash: 'video-hash' },
      url: { hash: 'main-trailer-hash' },
      ageLimit: false,
      categoryId: 100516,
    },
    bookable: false,
    source: 'MOVIE',
    likeCount: 4,
    badgeText: '',
    shortDescription: '美泰兒最強壯IP【太空超人】 天選之人，英雄再起！',
    writers: [],
    production: 'Mattel Studios',
    synopsis: '美泰兒最強壯IP【太空超人】<br/>天選之人，英雄再起！',
    trailers: [],
    pictures: [],
    commentSetting: 'HIDE',
    manualTags: [],
    ...overrides,
  };
}

describe('coming soon movies', () => {
  it('maps LINE coming-soon items into normalized app records', () => {
    const movie = mapLineComingSoonMovie(lineItem());

    expect(movie).toMatchObject({
      lineMovieId: 'line-id-1',
      lineMovieDbId: '54581',
      lineUrlHash: 'movie-hash',
      posterUrl: 'https://obs.line-scdn.net/poster-hash/w280',
      chineseTitle: '太空超人',
      englishTitle: 'MASTERS OF THE UNIVERSE',
      releaseDate: '2026-06-03',
      displayReleaseDate: '6/3',
      releaseMonth: '2026-06',
      types: ['冒險', '動作', '家庭'],
      directors: ['崔維斯奈特'],
      actors: ['尼可拉斯葛拉辛'],
      summary: '美泰兒最強壯IP【太空超人】 天選之人，英雄再起！',
      lineTrailerHash: 'main-trailer-hash',
      likeCount: 4,
      broadcastStatus: 'COMING_SOON',
    });
    expect(movie.runTime).toBeUndefined();
  });

  it('handles missing optional LINE fields safely', () => {
    const movie = mapLineComingSoonMovie(
      lineItem({
        thumbnail: null,
        url: null,
        latestTrailer: null,
        mainTrailer: null,
        shortDescription: '',
        synopsis: '',
        genres: null,
        directors: null,
        cast: null,
        likeCount: null,
        runtime: null,
      })
    );

    expect(movie.posterUrl).toBeNull();
    expect(movie.lineUrlHash).toBeNull();
    expect(movie.lineTrailerHash).toBeNull();
    expect(movie.summary).toBe('');
    expect(movie.types).toEqual([]);
    expect(movie.directors).toEqual([]);
    expect(movie.actors).toEqual([]);
    expect(movie.likeCount).toBe(0);
    expect(movie.runTime).toBeUndefined();
  });

  it('groups movies by release month and date with interest ordering inside a date', () => {
    const groups = groupComingSoonMoviesByMonth([
      mapLineComingSoonMovie(lineItem({ id: 'low', movieId: '1', title: '低人氣', likeCount: 1 })),
      mapLineComingSoonMovie(lineItem({ id: 'high', movieId: '2', title: '高人氣', likeCount: 20 })),
      mapLineComingSoonMovie(
        lineItem({
          id: 'next-month',
          movieId: '3',
          title: '下個月',
          releaseDate: Date.UTC(2026, 6, 1, 16),
          likeCount: 5,
        })
      ),
    ]);

    expect(groups.map((group) => group.month)).toEqual(['2026-06', '2026-07']);
    expect(groups[0].dates[0].releaseDate).toBe('2026-06-03');
    expect(groups[0].dates[0].movies.map((movie) => movie.chineseTitle)).toEqual(['高人氣', '低人氣']);
    expect(groups[1].dates[0].movies[0].chineseTitle).toBe('下個月');
  });
});
