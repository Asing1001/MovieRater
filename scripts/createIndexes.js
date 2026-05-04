#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }
}

const indexSpecs = [
  {
    collection: 'schedules',
    indexes: [
      { key: { lineMovieDbId: 1, date: 1 } },
      { key: { lineTheaterId: 1, date: 1 } },
      { key: { theaterName: 1, date: 1 } },
    ],
  },
  {
    collection: 'mergedDatas',
    indexes: [
      { key: { movieBaseId: 1 } },
      { key: { yahooId: 1 } },
    ],
  },
  {
    collection: 'movieBases',
    indexes: [
      { key: { lineMovieDbId: 1 } },
      { key: { yahooId: -1 } },
      { key: { lineMovieId: 1 } },
    ],
  },
  {
    collection: 'theaters',
    indexes: [
      { key: { lineTheaterId: 1 } },
      { key: { name: 1 } },
      { key: { regionIndex: 1 } },
    ],
  },
  {
    collection: 'comingSoonMovies',
    indexes: [
      { key: { lineMovieDbId: 1 }, options: { unique: true } },
      { key: { broadcastStatus: 1, releaseDate: 1, likeCount: -1, chineseTitle: 1 } },
    ],
  },
  {
    collection: 'pttArticles',
    indexes: [
      { key: { movieBaseId: 1, date: -1 } },
      { key: { url: 1 } },
    ],
  },
  {
    collection: 'configs',
    indexes: [
      { key: { name: 1 } },
    ],
  },
];

const obsoleteIndexes = [
  { collection: 'mergedDatas', name: 'movieBaseId_-1', key: { movieBaseId: -1 } },
  { collection: 'comingSoonMovies', name: 'releaseDate_1_likeCount_-1', key: { releaseDate: 1, likeCount: -1 } },
  { collection: 'pttArticles', name: 'url_-1', key: { url: -1 } },
  { collection: 'pttArticles', name: 'movieBaseId_1', key: { movieBaseId: 1 } },
  { collection: 'pttArticles', name: 'date_1', key: { date: 1 } },
];

function sameKey(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function hasCompatibleIndex(existingIndexes, key, options) {
  return existingIndexes.some((index) => {
    if (!sameKey(index.key, key)) return false;
    if (options.unique !== undefined && Boolean(index.unique) !== Boolean(options.unique)) return false;
    return true;
  });
}

async function main() {
  loadEnv();
  if (!process.env.DB_URL) {
    throw new Error('DB_URL is required');
  }

  const client = new MongoClient(process.env.DB_URL);
  await client.connect();
  const db = client.db();

  try {
    for (const { collection, indexes } of indexSpecs) {
      const col = db.collection(collection);
      const existingIndexes = await col.indexes();
      for (const { key, options = {} } of indexes) {
        if (hasCompatibleIndex(existingIndexes, key, options)) {
          console.log(`${collection}: skip existing ${JSON.stringify(key)}`);
          continue;
        }
        const name = await col.createIndex(key, options);
        console.log(`${collection}: ${name}`);
      }
    }

    for (const { collection, name, key } of obsoleteIndexes) {
      const col = db.collection(collection);
      const existingIndexes = await col.indexes();
      const obsoleteIndex = existingIndexes.find((index) => (
        index.name === name && sameKey(index.key, key)
      ));
      if (!obsoleteIndex) {
        console.log(`${collection}: skip missing obsolete ${name}`);
        continue;
      }
      await col.dropIndex(name);
      console.log(`${collection}: dropped obsolete ${name}`);
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
