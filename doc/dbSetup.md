# MongoDB Index Setup

Pages query MongoDB directly (no in-memory cache dependency), so indexes are important for keeping ISR renders fast.

## Required Indexes

Run these once against your Atlas cluster (via mongosh or the Atlas UI):

```js
// Theater detail page: schedules by lineTheaterId
db.schedules.createIndex({ lineTheaterId: 1 })

// Movie detail page: schedules by lineMovieDbId
db.schedules.createIndex({ lineMovieDbId: 1 })

// Movie page: lookup mergedDatas by movieBaseId (URL-based lookup)
db.mergedDatas.createIndex({ movieBaseId: 1 })

// Movie page: fallback lookup by yahooId
db.mergedDatas.createIndex({ yahooId: 1 })

// Theater schedule enrichment: movie metadata by lineMovieDbId
db.mergedDatas.createIndex({ lineMovieDbId: 1 })

// PTT articles: lookup by movieBaseId and date
db.pttArticles.createIndex({ movieBaseId: 1, date: -1 })

// PTT articles: dedup by URL
db.pttArticles.createIndex({ url: -1 })

// Yahoo movies: dedup / lookup
db.yahooMovies.createIndex({ yahooId: -1 })
```

## Theaters Collection

Theaters are sorted by `regionIndex` on the list page. That field is a string, so alphabetic sort is used — no index needed for the small theaters collection.

## Notes

- `schedules` grows to ~10k documents per refresh cycle. Without the `lineTheaterId` and `lineMovieDbId` indexes, theater/movie page renders do full collection scans (~50-200ms). With indexes, lookups are < 5ms.
- `mergedDatas` and `yahooMovies` are rebuilt by the nightly merge job. Indexes survive the rebuild because the job upserts documents rather than dropping the collection.
