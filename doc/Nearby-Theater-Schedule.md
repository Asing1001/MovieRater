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

## Pages

- `/theaters` — full theater list, sorted by region, ISR-cached 1 hour
- `/theater/[name]` — showtimes for a specific theater, ISR-cached 1 hour
