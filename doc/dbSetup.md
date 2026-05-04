# MongoDB Indexes

Keep page renders fast by ensuring these indexes exist:

```bash
npm run db:rename-movie-bases
npm run db:indexes
```

`db:rename-movie-bases` is a one-time migration from the legacy collection name to `movieBases`; it is safe to rerun after migration.

```js
db.schedules.createIndex({ lineMovieDbId: 1, date: 1 })
db.schedules.createIndex({ lineTheaterId: 1, date: 1 })
db.schedules.createIndex({ theaterName: 1, date: 1 })

db.mergedDatas.createIndex({ movieBaseId: 1 })
db.mergedDatas.createIndex({ yahooId: 1 })

db.movieBases.createIndex({ lineMovieDbId: 1 })
db.movieBases.createIndex({ yahooId: -1 })
db.movieBases.createIndex({ lineMovieId: 1 })

db.theaters.createIndex({ lineTheaterId: 1 })
db.theaters.createIndex({ name: 1 })
db.theaters.createIndex({ regionIndex: 1 })

db.comingSoonMovies.createIndex({ lineMovieDbId: 1 }, { unique: true })
db.comingSoonMovies.createIndex({ broadcastStatus: 1, releaseDate: 1, likeCount: -1, chineseTitle: 1 })

db.pttArticles.createIndex({ movieBaseId: 1, date: -1 })
db.pttArticles.createIndex({ url: 1 })
```

Notes:

- Indexes are operational setup. Crawlers/tasks should not create them on every run.
- Detail pages depend most on `schedules.lineMovieDbId`, `schedules.lineTheaterId`, `mergedDatas.movieBaseId`, and `movieBases.lineMovieDbId`.
- `npm run db:indexes` also drops obsolete duplicates: reverse `movieBaseId`, reverse `url`, single-field PTT article/date indexes covered by compounds, and the older upcoming-page sort index.
