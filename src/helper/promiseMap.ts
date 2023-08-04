import { chunk } from "./chunk"

export async function promiseMap(items, callback, concurrency) {
  const itemChunks = chunk(items, concurrency)
  const result = []
  for (const chunk of itemChunks) {
    const chunkResults = await Promise.all(chunk.map(callback))
    result.push(...chunkResults)
  }
  return result
}