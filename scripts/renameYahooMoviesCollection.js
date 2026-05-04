#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const SOURCE_COLLECTION = 'yahooMovies';
const TARGET_COLLECTION = 'movieBases';

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

async function collectionExists(db, name) {
  const collections = await db.listCollections({ name }).toArray();
  return collections.length > 0;
}

async function logCollectionState(db, name) {
  if (!(await collectionExists(db, name))) {
    console.log(`${name}: missing`);
    return;
  }

  const collection = db.collection(name);
  const [count, indexes] = await Promise.all([
    collection.estimatedDocumentCount(),
    collection.indexes(),
  ]);
  console.log(`${name}: ${count} docs`);
  for (const index of indexes) {
    console.log(`${name}: index ${index.name} ${JSON.stringify(index.key)}`);
  }
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
    const sourceExists = await collectionExists(db, SOURCE_COLLECTION);
    const targetExists = await collectionExists(db, TARGET_COLLECTION);

    await logCollectionState(db, SOURCE_COLLECTION);
    await logCollectionState(db, TARGET_COLLECTION);

    if (!sourceExists && targetExists) {
      console.log('Already migrated.');
      return;
    }

    if (!sourceExists && !targetExists) {
      throw new Error(`Neither ${SOURCE_COLLECTION} nor ${TARGET_COLLECTION} exists.`);
    }

    if (sourceExists && targetExists) {
      throw new Error(`Both ${SOURCE_COLLECTION} and ${TARGET_COLLECTION} exist. Refusing to choose a source.`);
    }

    await db.collection(SOURCE_COLLECTION).rename(TARGET_COLLECTION, { dropTarget: false });
    console.log(`Renamed ${SOURCE_COLLECTION} to ${TARGET_COLLECTION}.`);

    await logCollectionState(db, TARGET_COLLECTION);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
