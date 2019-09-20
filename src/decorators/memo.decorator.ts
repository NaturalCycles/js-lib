// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
// https://community.risingstack.com/the-worlds-fastest-javascript-memoization-library/

import { since } from '../util/time.util'
import { getArgsSignature, getMethodSignature, getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

export interface MemoOpts {
  logHit?: boolean
  logMiss?: boolean

  /**
   * Skip logging method arguments.
   */
  noLogArgs?: boolean

  /**
   * Provide a custom implementation of MemoCache.
   * Function that creates an instance of `MemoCache`.
   * e.g LRUMemoCache from `@naturalcycles/nodejs-lib`
   */
  cacheFactory?: () => MemoCache

  /**
   * Don't cache resolved promises.
   * Setting this to `true` will make the decorator to await the result.
   */
  noCacheResolved?: boolean

  /**
   * Don't cache rejected promises.
   * Setting this to `true` will make the decorator to await the result.
   */
  noCacheRejected?: boolean
}

/**
 * Memoizes the method of the class, so it caches the output and returns the cached version if the "key"
 * of the cache is the same. Key, by defaul, is calculated as `JSON.stringify(...args)`.
 * Cache is stored indefinitely in internal Map.
 *
 * Cache is stored **per instance** - separate cache for separate instances of the class.
 * If you don't want it that way - you can use a static method, then there will be only one "instance".
 *
 * Supports dropping it's cache by calling .dropCache() method of decorated function (useful in unit testing).
 */
export const memo = (opts: MemoOpts = {}): MethodDecorator => (target, key, descriptor) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value

  // Map<ctx => MemoCache<cacheKey, result>>
  //
  // Internal map is from cacheKey to result
  // External map is from ctx (instance of class) to Internal map
  // External map is Weak to not cause memory leaks, to allow ctx objects to be garbage collected
  // UPD: tests show that normal Map also doesn't leak (to be tested further)
  // Normal Map is needed to allow .dropCache()
  const cache = new Map<object, MemoCache>()

  const { logHit, logMiss, noLogArgs, cacheFactory, noCacheRejected, noCacheResolved } = {
    cacheFactory: () => new MapMemoCache(),
    ...opts,
  }
  const awaitPromise = Boolean(noCacheRejected || noCacheResolved)
  const keyStr = String(key)
  const methodSignature = getTargetMethodSignature(target, keyStr)

  descriptor.value = function(this: typeof target, ...args: any[]): any {
    const ctx = this

    const cacheKey = jsonMemoSerializer(args)

    if (!cache.has(ctx)) {
      cache.set(ctx, cacheFactory())
    } else if (cache.get(ctx)!.has(cacheKey)) {
      if (logHit) {
        console.log(
          `${getMethodSignature(ctx, keyStr)}(${getArgsSignature(
            args,
            noLogArgs,
          )}) @memoInstance hit`,
        )
      }

      const res = cache.get(ctx)!.get(cacheKey)

      if (awaitPromise) {
        return res instanceof Error ? Promise.reject(res) : Promise.resolve(res)
      } else {
        return res
      }
    }

    const started = Date.now()

    const res: any = originalFn.apply(ctx, args)

    if (awaitPromise) {
      return (res as Promise<any>)
        .then(res => {
          // console.log('RESOLVED', res)
          if (logMiss) {
            console.log(
              `${getMethodSignature(ctx, keyStr)}(${getArgsSignature(
                args,
                noLogArgs,
              )}) @memo miss resolved (${since(started)})`,
            )
          }

          if (!noCacheResolved) {
            cache.get(ctx)!.set(cacheKey, res)
          }

          return res
        })
        .catch(err => {
          // console.log('REJECTED', err)
          if (logMiss) {
            console.log(
              `${getMethodSignature(ctx, keyStr)}(${getArgsSignature(
                args,
                noLogArgs,
              )}) @memo miss rejected (${since(started)})`,
            )
          }

          if (!noCacheRejected) {
            // We put it to cache as raw Error, not Promise.reject(err)
            // So, we'll need to check if it's instanceof Error to reject it or resolve
            // Wrap as Error if it's not Error
            cache.get(ctx)!.set(cacheKey, err instanceof Error ? err : new Error(err))
          }

          return Promise.reject(err)
        })
    } else {
      if (logMiss) {
        console.log(
          `${getMethodSignature(ctx, keyStr)}(${getArgsSignature(
            args,
            noLogArgs,
          )}) @memo miss (${since(started)})`,
        )
      }

      cache.get(ctx)!.set(cacheKey, res)
      return res
    }
  } as any
  ;(descriptor.value as any).dropCache = () => {
    console.log(`${methodSignature} @memo.dropCache()`)
    cache.forEach(memoCache => memoCache.clear())
    cache.clear()
  }

  return descriptor
}
