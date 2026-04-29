# Modernization Plan

## Current Baseline

- Production URL: https://www.mvrater.com/
- Current runtime target: Node 12.22.x (`package.json` and `.nvmrc`)
- Local shell observed during baseline: Node 21.7.1, no global `yarn`
- Local services: Docker Compose starts MongoDB 4.2 on `27018` and Redis on `6380`
- Build: `npm run build` succeeds
- Test: `npm test` passes after moving IMDB crawler checks to fixture-backed default tests

### Baseline Test Result

Original `npm test` result after starting Docker services:

- 24 passing
- 9 pending
- 7 failing

Known failures:

- IMDB crawler tests return empty ratings for several movies.
- PTT missing-page test expected a 404 message but received `ECONNRESET`.
- The suite writes coverage helper files outside the repo, so sandboxed runs need approval.

Current `npm test` result after test stabilization:

- 29 passing
- 11 pending
- 0 failing

Changes made:

- IMDB crawler default tests use local fixtures for suggestion matching and rating parsing.
- Live IMDB coverage is opt-in with `ENABLE_LIVE_CRAWLER_TESTS=true`.
- The LINE crawler no longer dumps full API payloads during tests.
- `systemSetting` logging redacts connection strings and task keys.

### Baseline Build Result

`npm run build` succeeds with Webpack 2.5.1.

Notable emitted assets before gzip:

- `main.*.js`: 727 kB
- `vendor.*.js`: 275 kB
- `vendor.*.css`: 123 kB
- `Preview.png`: 401 kB
- `AddToHomeAndroid.png`: 565 kB
- `AddToHomeiOS.png`: 946 kB

## Recommendation

Rewrite the web application shell, but do it in phases. The crawler and data model are the valuable, fragile parts of the product, so they should be isolated and covered before replacing the UI/server framework.

Target platform:

- Node 24 LTS
- TypeScript current stable
- React current stable
- Next.js for SSR, routing, and production build tooling
- MongoDB and Redis retained initially

Node 24 is the preferred target because it is current LTS and gives the longest runway. Node 20 is too close to end-of-life to be worth targeting as the next long-lived runtime.

## Migration Strategy

### Phase 1: Stabilize Behavior

- Keep the existing app running as the reference implementation.
- Document key public routes and GraphQL queries:
  - `/`
  - `/upcoming`
  - `/movie/:id`
  - `/movies/:ids`
  - `/theaters`
  - `/theater/:name`
  - `/graphql`
- Replace live-network crawler unit tests with fixture-backed contract tests.
- Keep a small number of opt-in integration tests for real external sites.
- Keep default test output concise enough to spot real failures quickly.

### Phase 2: Extract Domain and Data Modules

- Move crawler, merge, schedule, and cache logic behind typed service interfaces.
- Add cache indexes for common lookups:
  - movie by `movieBaseId`
  - movie by `yahooId`
  - movie by Chinese title
  - schedules by movie name
  - schedules by theater schedule URL
  - theater by schedule URL
- Preserve Mongo collection names and document shapes at first.

### Phase 3: Build the New App Shell

- Introduce a modern app in a separate directory first, for example `apps/web`.
- Implement pages from the existing behavior using the extracted services.
- Avoid changing crawler persistence and UI at the same time.
- Use production HTML from https://www.mvrater.com/ as a comparison target for content behavior.

### Phase 4: Modernize Runtime and Deployment

- Move production runtime to Node 24.
- Decide whether to keep Heroku or move to a container deployment.
- Update Dockerfile, CI, and Heroku/GCP deployment docs.
- Remove legacy deployment assumptions after the replacement path is proven.

## First Implementation Slice

The first code slice was conservative and immediately useful:

1. Add fixture-backed tests around current GraphQL/query behavior.
2. Add cache indexes inside the existing app to remove repeated linear scans.
3. Fix the hard-coded desktop movie summary in `movieDetail.tsx`.
4. Move Apollo client creation out of React render.
5. Split live crawler tests from default unit tests.

This makes the current app faster and more testable while creating guardrails for the rewrite.

Status:

- Done: cache indexes for hot GraphQL lookup paths.
- Done: desktop movie detail summary uses movie data instead of hard-coded content.
- Done: Apollo client creation no longer happens during render.
- Done: IMDB live tests split from default test flow.
- Done: production config logging redacted.

## Next Implementation Slice

Recommended next work:

1. Stop default `npm test` from uploading Codecov locally; reserve upload for CI.
2. Reduce DB/task debug output in tests, especially `updateDocument(...)` spam from LINE task tests.
3. Add route/query smoke tests for the current SSR pages before deeper refactors.
4. Upgrade the production runtime target away from Node 12, starting with the smallest supported Heroku runtime step.
5. Add a temporary staging Heroku app or preview deployment before the larger rewrite begins.

## Risks

- Current tests mutate local Mongo data and call real external services.
- Some crawlers depend on third-party HTML/API shapes that can change without notice.
- React 15 and Material-UI 0.x cannot be incrementally upgraded all the way to current React/MUI without significant UI work.
- SSR currently depends on request-level globals, which is fragile under concurrent traffic.
- Heroku still builds with Node 12, which is end-of-life and will eventually become a build blocker.
- The default `posttest` script uploads Codecov from local machines and includes a token in `package.json`.

## Decision

Proceed with a phased rewrite. Start by stabilizing and extracting behavior from the existing application, then introduce a modern Next.js application shell that can be compared against production before traffic is moved.
