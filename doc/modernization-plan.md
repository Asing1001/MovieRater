# Architecture Notes

## Migration History

The app was originally an Express + Webpack + React 15 + Heroku stack. It has been fully rewritten as a Next.js 15 App Router application deployed on GCP Cloud Run.

Completed phases:
- **Phase 1** — Stabilized tests (fixture-backed crawlers, guarded live tests)
- **Phase 2** — Extracted domain modules (crawlers, cache, scheduler behind typed interfaces)
- **Phase 3** — Next.js 15 App Router rewrite (SSR pages, API routes, MUI v6)
- **Phase 4** — GCP Cloud Run deployment (Terraform, GitHub Actions, Workload Identity Federation, no Heroku)

## Data Flow

```
MongoDB Atlas
    │
    ├─ instrumentation.ts (on server start)
    │    └─ warms in-memory cacheManager (background, non-blocking)
    │         used by: scheduler tasks
    │
    ├─ Pages (ISR, revalidate=3600)
    │    /theaters          → db.theaters.find()
    │    /theater/[name]    → db.theaters.findOne() + db.schedules.find()
    │    /movie/[id]        → db.mergedDatas.findOne() + db.schedules.find()
    │
    └─ Cloud Scheduler → API routes (hourly / daily)
         /api/tasks/line   → LINE crawler → upserts theaters + schedules
         /api/tasks/imdb   → IMDB ratings backfill → upserts yahooMovies
         /api/tasks/ptt    → PTT crawler → upserts pttArticles
```

## Caching Strategy

- **ISR (1 hour)**: `/theaters`, `/theater/[name]`, `/movie/[id]` — rendered from MongoDB on first request per revalidation window, then served from Next.js full-route cache. CDN can cache the response.
- **In-memory cacheManager**: used only by scheduler tasks for fast lookups (movie by lineMovieDbId, schedules by theater, etc.). Lost on instance restart — does not affect page correctness.
- **Cold starts**: Cloud Run scale-to-zero means the first request after idle starts a new instance (~2s). Pages query MongoDB directly so there is no warm-up penalty for users.

## Collections

| Collection | Written by | Read by |
|---|---|---|
| `mergedDatas` | nightly merge job | movie pages, schedule enrichment |
| `yahooMovies` | LINE/Yahoo crawlers | movie enrichment (lineMovieDbId, imdbRating) |
| `theaters` | LINE crawler | theater list/detail pages |
| `schedules` | LINE crawler (hourly) | theater/movie pages |
| `pttArticles` | PTT crawler (daily) | movie detail page |

## Deployment

See [`terraform/`](../terraform/) for all GCP resources. GitHub Actions builds and pushes Docker images on every push to `master`; Cloud Run is updated via `gcloud run deploy`.
