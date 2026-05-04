# Architecture

This is the doc to read before changing data flow, caching, routing, or crawlers.

## Runtime

- Next.js 15 App Router, React 19, MUI 6, standalone Docker output.
- Hosted on Cloud Run behind Cloudflare.
- MongoDB Atlas is the source of truth. Pages query MongoDB directly.
- `src/instrumentation.ts` opens MongoDB and warms in-memory caches on server start; those caches help tasks, not page correctness.

## Data Flow

`POST /api/tasks/line` is the main refresh path:

1. `updateComingSoonMovies()` crawls LINE coming-soon data into `comingSoonMovies`.
2. `updateLINEMovies()` crawls LINE in-cinema movies into `movieBases`.
3. `updateLineSchedules()` crawls LINE showtimes, replaces `schedules`, and upserts LINE theaters.
4. The task calls `revalidatePath()` for theater pages, `/upcoming`, and sitemap.

Other scheduled tasks:

- `POST /api/tasks/imdb`: backfills IMDb fields, then revalidates movie pages and sitemap.
- `POST /api/tasks/ptt`: crawls PTT articles, updates PTT counts in movie data, then revalidates sitemap.

All `/api/tasks/*` endpoints require `X-Schedule-Task-Token` to match `SCHEDULE_TASK_API_TOKEN`. Cloud Scheduler injects the header from Terraform's sensitive `schedule_task_api_token` variable.

Cloud Scheduler config lives in `terraform/gcp.tf`:

- LINE hourly: `10 * * * *`
- IMDb daily: `40 6 * * *`
- PTT daily: `0 4 * * *`
- Timezone: `Asia/Taipei`

## Collections

- `movieBases`: LINE-sourced movie metadata plus rating/enrichment fields; used by theater schedule cards and movie fallback enrichment.
- `mergedDatas`: merged movie detail records; primary source for `/movie/[id]`.
- `theaters`: LINE theaters only matter for public pages; valid rows have `lineTheaterId`.
- `schedules`: current LINE schedules, keyed by `lineTheaterId` and `lineMovieDbId`.
- `comingSoonMovies`: LINE upcoming-release calendar.
- `pttArticles`: PTT article rows for movie detail pages.

Important mapping rule: schedule joins should use LINE ids (`lineTheaterId`, `lineMovieDbId`). Do not depend on theater/movie display names when an id exists.

## DB Change Workflow

Use local Docker MongoDB first for scripts and destructive/refactor migrations:

```bash
docker compose up -d mongodb
DB_URL=mongodb://localhost:27018/movie-rater npm run <db-script>
```

Only run against Atlas during the production migration window. For collection renames or destructive index work:

1. Pause Cloud Scheduler jobs in `asia-east1`.
2. Deploy code that expects the new schema/collection.
3. Run the DB migration script against Atlas.
4. Run `npm run db:indexes`.
5. Verify key live pages.
6. Resume Scheduler.

## Pages

- `/`: recent movies from cached movie data.
- `/upcoming`: `comingSoonMovies`, force-dynamic, CDN-cached by headers.
- `/theaters`: Mongo `theaters` filtered to rows with `lineTheaterId`.
- `/theater/[name]`: finds the LINE theater first, then schedules by `lineTheaterId`, then enriches movies from `movieBases`.
- `/movie/[id]`: `mergedDatas` by `movieBaseId` or `yahooId`, then schedules by `lineMovieDbId`, then PTT articles.
- `/search`: query page plus `/api/search` autocomplete.

## Caching

`next.config.ts` sets browser `max-age=0` and CDN `s-maxage`/`stale-while-revalidate`.

- `/`: 10 minutes.
- `/search`: 5 minutes.
- `/movie/[id]`, `/theater/[name]`, `/theaters`, `/upcoming`, sitemap: 1 hour.
- `/api/*`: `no-store`.

Cloudflare Worker: `cloudflare/vary-fix-worker.js`.

- Bypasses `/api/*`, non-GET requests, and RSC requests with `rsc: 1`.
- Caches normal HTML GET responses at the edge after changing `Vary` to `Accept-Encoding`.
- `HEAD` is non-GET and bypasses the Worker cache. To verify HTML cache, use:

```bash
curl -s -D - -o /dev/null https://www.mvrater.com/movie/<id>
```

During debugging, a clean public URL may show stale HTML because Cloudflare or Next full-route cache has not expired/revalidated. Use DB checks plus a cache-busting query string to separate data bugs from cache state.

## Loading UI

Do not add route-level `loading.tsx` for `/movie/[id]` or `/theater/[name]` unless direct URL access is allowed to show a placeholder. Next can stream route loading UI on hard loads, which is bad for SEO and looks wrong on cached detail pages.

Current pattern:

- Direct URL access SSRs completed HTML.
- Client-side navigation uses `src/components/NavigationLoadingBoundary.tsx`.
- Skeleton components are client-only placeholders for internal transitions.
