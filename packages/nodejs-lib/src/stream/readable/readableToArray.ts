import type { ReadableTyped } from '../stream.model.js'

/**
 * Convenience function to read the whole Readable stream into Array (in-memory)
 * and return that array.
 *
 * Native `await readable.toArray()` can be used instead.
 * This helper is kept for type-safery support.
 */
export async function readableToArray<T>(readable: ReadableTyped<T>): Promise<T[]> {
  return await readable.toArray()
  // const a: T[] = []
  //
  // for await (const item of readable) {
  //   a.push(item)
  // }
  //
  // return a
}
