# MovieRater

[![Build & Deploy](https://github.com/Asing1001/MovieRater/actions/workflows/build.yml/badge.svg)](https://github.com/Asing1001/MovieRater/actions)

Aggregates PTT, IMDB, and Yahoo movie data to help you find high-rated movies playing in Taiwanese theaters.

**Live site:** https://www.mvrater.com

## Stack

| Layer | Technology |
|---|---|
| Frontend / SSR | Next.js 15 (App Router, standalone output) |
| Database | MongoDB Atlas |
| Hosting | GCP Cloud Run (scale-to-zero) |
| Container registry | GCP Artifact Registry |
| Scheduled crawls | GCP Cloud Scheduler → Cloud Run API routes |
| Secrets | GCP Secret Manager |
| CI/CD | GitHub Actions + Workload Identity Federation |
| Infrastructure | Terraform |

## Local Development

**Prerequisites:** Node 20 (`nvm use`), a MongoDB connection string.

1. Copy `.env.example` to `.env` and fill in `DB_URL` and `OMDB_API_KEY`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3000.

To run in production mode locally:
```bash
npm run build
cp -r .next/static .next/standalone/.next/static
node .next/standalone/server.js
```

## Data Setup

On a fresh database, run the one-time setup to seed theaters and initial movie data:

```bash
npx ts-node src/dbScript/firstTimeSetup.ts
```

Then trigger the crawlers manually (or wait for the Cloud Scheduler jobs):

```bash
# Populate LINE movie schedules and theaters
curl -X POST http://localhost:3000/api/tasks/line

# Backfill IMDB ratings
curl -X POST http://localhost:3000/api/tasks/imdb

# Crawl PTT movie articles
curl -X POST http://localhost:3000/api/tasks/ptt
```

## Tests

```bash
npm test
```

Live crawler tests (hit real external APIs) are opt-in:
```bash
ENABLE_LIVE_CRAWLER_TESTS=true npm test
```

## Application Flow

1. Server starts, opens MongoDB connection via `instrumentation.ts`.
2. In-memory cache warms up in the background (movies, schedules, theaters).
3. Cloud Scheduler fires API routes on a schedule:
   - `POST /api/tasks/line` — every hour at :10, refreshes LINE movie schedules and theaters
   - `POST /api/tasks/imdb` — daily at 06:40, backfills IMDB ratings
   - `POST /api/tasks/ptt` — daily at 04:00, crawls PTT movie articles
4. Pages (`/theaters`, `/theater/[name]`, `/movie/[id]`) query MongoDB directly and are ISR-cached for 1 hour, so CDN can serve them without hitting the server.

## Routes

| Route | Description |
|---|---|
| `/` | Recent movies in theaters |
| `/upcoming` | Upcoming releases |
| `/search` | Movie search (autocomplete) |
| `/movie/[id]` | Movie detail: ratings, cast, PTT articles, showtimes |
| `/theaters` | Theater list |
| `/theater/[name]` | Theater showtimes |
| `/api/tasks/line` | LINE schedule crawler (Cloud Scheduler target) |
| `/api/tasks/imdb` | IMDB ratings backfill (Cloud Scheduler target) |
| `/api/tasks/ptt` | PTT articles crawler (Cloud Scheduler target) |

## Infrastructure (Terraform)

All GCP resources are managed in `terraform/`.

```bash
cd terraform
gcloud auth application-default login
terraform init
terraform plan
terraform apply
```

After first `apply`, add secret values:
```bash
echo -n "mongodb+srv://..." | gcloud secrets versions add db-url --data-file=-
echo -n "your-omdb-key"    | gcloud secrets versions add omdb-api-key --data-file=-
```

GitHub Actions deploys on every push to `master` using Workload Identity Federation — no long-lived service account keys required. Set these two repository secrets from `terraform output`:
- `WORKLOAD_IDENTITY_PROVIDER`
- `SERVICE_ACCOUNT`

## MongoDB Indexes

See [`doc/dbSetup.md`](doc/dbSetup.md) for recommended indexes to keep page queries fast.
