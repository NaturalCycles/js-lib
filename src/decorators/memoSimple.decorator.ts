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

import { CommonLogger } from '../log/commonLogger'
import { _getArgsSignature, _getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

export interface MemoOpts {
  logHit?: boolean
  logMiss?: boolean
  noLogArgs?: boolean
  logger?: CommonLogger
}

// memoSimple decorator is NOT exported. Only used in benchmarks currently

/**
 * Memoizes the method of the class, so it caches the output and returns the cached version if the "key"
 * of the cache is the same. Key, by defaul, is calculated as `JSON.stringify(...args)`.
 * Cache is stored indefinitely in internal Map.
 * There is more advanced version of memo decorator called `memoCache`.
 *
 * Supports dropping it's cache by calling .dropCache() method of decorated function (useful in unit testing).
 */
export const memoSimple =
  (opt: MemoOpts = {}): MethodDecorator =>
  (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError('Memoization can be applied only to methods')
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

    const { logHit, logMiss, noLogArgs, logger = console } = opt
    const keyStr = String(key)
    const methodSignature = _getTargetMethodSignature(target, keyStr)

    descriptor.value = function (this: typeof target, ...args: any[]): any {
      const ctx = this
      const cacheKey = jsonMemoSerializer(args)

      if (cache.has(cacheKey)) {
        if (logHit) {
          logger.log(`${methodSignature}(${_getArgsSignature(args, noLogArgs)}) @memo hit`)
        }
        return cache.get(cacheKey)
      }

      const d = Date.now()

      const res: any = originalFn.apply(ctx, args)

      if (logMiss) {
        logger.log(
          `${methodSignature}(${_getArgsSignature(args, noLogArgs)}) @memo miss (${
            Date.now() - d
          } ms)`,
        )
      }

      cache.set(cacheKey, res)

      return res
    } as any
    ;(descriptor.value as any).dropCache = () => {
      logger.log(`${methodSignature} @memo.dropCache()`)
      cache.clear()
    }

    return descriptor
  }
