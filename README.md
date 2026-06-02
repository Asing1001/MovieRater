# MovieRater

Next.js app for Taiwanese movie ratings, theater schedules, and upcoming releases.

Live site: https://www.mvrater.com

## Quick Start

Required: Node 22+, `.env` with `DB_URL`, `OMDB_API_KEY`, and `SCHEDULE_TASK_API_TOKEN`.

```bash
npm install
npm run dev
npm test
npm run build
```

Dev server defaults to http://localhost:3000.

Runtime configuration is intentionally small:

- `DB_URL`: MongoDB connection string.
- `OMDB_API_KEY`: OMDb API key for IMDb rating backfill.
- `SCHEDULE_TASK_API_TOKEN`: shared token for `/api/tasks/*`.

## Architecture

Read [doc/architecture.md](doc/architecture.md) first. It is the compact map for data flow, caching, Cloudflare behavior, and the App Router loading pattern.

## Common Tasks

Local crawler run:

```bash
curl -X POST -H "X-Schedule-Task-Token: $SCHEDULE_TASK_API_TOKEN" http://localhost:3000/api/tasks/line
curl -X POST -H "X-Schedule-Task-Token: $SCHEDULE_TASK_API_TOKEN" http://localhost:3000/api/tasks/imdb
curl -X POST -H "X-Schedule-Task-Token: $SCHEDULE_TASK_API_TOKEN" http://localhost:3000/api/tasks/ptt
```

Cloud Scheduler sends the same `X-Schedule-Task-Token` header. Configure production with the sensitive Terraform variable `schedule_task_api_token`.

Live crawler tests are opt-in:

```bash
ENABLE_LIVE_CRAWLER_TESTS=true npm test
```

Mongo integration tests use the local docker-compose MongoDB on port `27018`:

```bash
docker compose up -d mongodb
npm run test:integration:mongo
```

MongoDB indexes: [doc/dbSetup.md](doc/dbSetup.md).

```bash
npm run db:rename-movie-bases
npm run db:indexes
```

Cloudflare Worker source: [cloudflare/vary-fix-worker.js](cloudflare/vary-fix-worker.js).
