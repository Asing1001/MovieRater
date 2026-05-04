# Theater Schedules

Theater data comes from the LINE Movies API, crawled hourly by `POST /api/tasks/line`.

## Data Source

- Theater list and showtimes: LINE Movies API (`lineScheduleCrawler.ts`)
- Theater metadata (address, phone, city): stored in the `theaters` collection, enriched from LINE data
- Schedules: stored in the `schedules` collection, keyed by `lineTheaterId` and `lineMovieDbId`

## Schedule Refresh

The Cloud Scheduler job `line-hourly` fires at 10 minutes past every hour (Asia/Taipei):

```
POST /api/tasks/line
```

This crawls the LINE Movies API, upserts all theaters and their schedules, and updates the in-memory cache used by background tasks.

The production hostname is behind Cloudflare. Normal HTML requests may be served
from the Cloudflare Worker cache or the Next.js full-route cache according to
the `s-maxage` and `stale-while-revalidate` headers in `next.config.ts`. When
debugging schedule changes, confirm both the database state and the cache layer:

- `/api/tasks/line` bypasses Cloudflare HTML caching and refreshes schedules.
- A cache-busting query string on a theater URL can confirm whether a fresh render
  sees the expected MongoDB data.
- The clean public URL may still show stale HTML until the edge/full-route cache
  is revalidated, expires, or a new deployment clears the cached render.

## Pages

- `/theaters` — full theater list, sorted by region, ISR-cached 1 hour
- `/theater/[name]` — showtimes for a specific theater, ISR-cached 1 hour
