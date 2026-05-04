# MovieRater

Next.js app for Taiwanese movie ratings, theater schedules, and upcoming releases.

Live site: https://www.mvrater.com

## Quick Start

Required: Node 22+, `.env` with `DB_URL` and `OMDB_API_KEY`.

```bash
npm install
npm run dev
npm test
npm run build
```

Dev server defaults to http://localhost:3000.

## Architecture

Read [doc/architecture.md](doc/architecture.md) first. It is the compact map for data flow, caching, Cloudflare behavior, and the App Router loading pattern.

## Common Tasks

Local crawler run:

```bash
curl -X POST http://localhost:3000/api/tasks/line
curl -X POST http://localhost:3000/api/tasks/imdb
curl -X POST http://localhost:3000/api/tasks/ptt
```

Live crawler tests are opt-in:

```bash
ENABLE_LIVE_CRAWLER_TESTS=true npm test
```

MongoDB indexes: [doc/dbSetup.md](doc/dbSetup.md).

```bash
npm run db:rename-movie-bases
npm run db:indexes
```

Cloudflare Worker source: [cloudflare/vary-fix-worker.js](cloudflare/vary-fix-worker.js).
