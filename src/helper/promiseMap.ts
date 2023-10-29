import { chunk } from './chunk';

interface PromiseMapOptions {
  concurrency: number;
  delay?: number;
}

export async function promiseMap<T, R>(
  items: T[],
  callback: (item: T) => Promise<R>,
  options: PromiseMapOptions
): Promise<R[]> {
  const { concurrency, delay } = options;
  const itemChunks = chunk(items, concurrency);
  const result: R[] = [];
  for (const chunk of itemChunks) {
    const chunkResults = await Promise.all(chunk.map(callback));
    result.push(...chunkResults);
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return result;
}
