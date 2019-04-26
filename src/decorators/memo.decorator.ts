// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
// https://community.risingstack.com/the-worlds-fastest-javascript-memoization-library/

/*
Optimized for 0 arguments (using SingleValueCache).
Optimized for 1 primitive argument (skips JSON.stringify).
Otherwise resorts to JSON.stringify.
Benchmark shows similar perf for ObjectCache and MapCache.
 */

import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

/**
 * Memoizes the method of the class, so it caches the output and returns the cached version if the "key"
 * of the cache is the same. Key, by defaul, is calculated as `JSON.stringify(...args)`.
 * Cache is stored indefinitely in internal Map.
 * There is more advanced version of memo decorator called `memoCache`.
 *
 * Supports dropping it's cache by calling .dropCache() method of decorated function (useful in unit testing).
 */
export const memo = (): MethodDecorator => (target, key, descriptor) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value
  // console.log(`${key} len: ${originalFn.length}`)

  // todo: optimization disabled until "default arg value" use case is solved (see memo.decorator.test.ts)
  /*
  let cache: MemoCache

  // Function with 0 arguments
  if (!originalFn.length) {
    cache = new SingleValueMemoCache()
  } else {
    // Function with > 0 arguments
    cache = new MapMemoCache()
    // cache = new ObjectMemoCache()
  }
   */
  const cache: MemoCache = new MapMemoCache()

  descriptor.value = function (this: any, ...args: any[]): any {
    const ctx = this
    const cacheKey = jsonMemoSerializer(args)

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const res: any = originalFn.apply(ctx, args)

    cache.set(cacheKey, res)
    // console.log('miss', cacheKey)

    return res
  } as any
  ;(descriptor.value as any).dropCache = () => {
    console.log(`memo.dropCache (method=${String(key)})`)
    cache.clear()
  }

  return descriptor
}
