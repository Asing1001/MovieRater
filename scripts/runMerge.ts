import { Mongo } from '../src/data/db';
import { runMerge } from '../src/task/mergeTask';

async function main() {
  await Mongo.openDbConnection();
  const merged = await runMerge();
  console.log(`scripts/runMerge: merged ${merged.length} movies`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => {
    Mongo.closeDbConnection();
  });
