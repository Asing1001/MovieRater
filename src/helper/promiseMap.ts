import { chunk } from "./chunk"

export async function promiseMap<T, R>(
  items: T[],
  callback: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const itemChunks = chunk(items, concurrency);
  const result: R[] = [];
  for (const chunk of itemChunks) {
    const chunkResults = await Promise.all(chunk.map(callback));
    result.push(...chunkResults);
  }
  return result;
}