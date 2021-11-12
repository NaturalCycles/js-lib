// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
// https://community.risingstack.com/the-worlds-fastest-javascript-memoization-library/

import { CommonLogger } from '../log/commonLogger'
import { _since } from '../time/time.util'
import { AnyObject } from '../types'
import { _getArgsSignature, _getMethodSignature, _getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

export interface MemoOptions {
  /**
   * Default to false
   */
  logHit?: boolean
  /**
   * Default to false
   */
  logMiss?: boolean

  /**
   * Skip logging method arguments.
   */
  noLogArgs?: boolean

  /**
   * Default to `console`
   */
  logger?: CommonLogger

  /**
   * Provide a custom implementation of MemoCache.
   * Function that creates an instance of `MemoCache`.
   * e.g LRUMemoCache from `@naturalcycles/nodejs-lib`
   */
  cacheFactory?: () => MemoCache

  /**
   * Provide a custom implementation of CacheKey function.
   */
  cacheKeyFn?: (args: any[]) => any

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
// eslint-disable-next-line @typescript-eslint/naming-convention
export const _Memo =
  (opt: MemoOptions = {}): MethodDecorator =>
  (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError('Memoization can be applied only to methods')
    }

    const originalFn = descriptor.value

    // Map<ctx => MemoCache<cacheKey, result>>
    //
    // Internal map is from cacheKey to result
    // External map is from ctx (instance of class) to Internal map
    // External map is Weak to not cause memory leaks, to allow ctx objects to be garbage collected
    // UPD: tests show that normal Map also doesn't leak (to be tested further)
    // Normal Map is needed to allow .dropCache()
    const cache = new Map<AnyObject, MemoCache>()

    const {
      logHit = false,
      logMiss = false,
      noLogArgs = false,
      logger = console,
      cacheFactory = () => new MapMemoCache(),
      cacheKeyFn = jsonMemoSerializer,
      noCacheRejected = false,
      noCacheResolved = false,
    } = opt

    const awaitPromise = Boolean(noCacheRejected || noCacheResolved)
    const keyStr = String(key)
    const methodSignature = _getTargetMethodSignature(target, keyStr)

    descriptor.value = function (this: typeof target, ...args: any[]): any {
      const ctx = this

      const cacheKey = cacheKeyFn(args)

      if (!cache.has(ctx)) {
        cache.set(ctx, cacheFactory())
      } else if (cache.get(ctx)!.has(cacheKey)) {
        if (logHit) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(args, noLogArgs)}) @_Memo hit`,
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
              logger.log(
                `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
                  args,
                  noLogArgs,
                )}) @_Memo miss resolved (${_since(started)})`,
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
              logger.log(
                `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
                  args,
                  noLogArgs,
                )}) @_Memo miss rejected (${_since(started)})`,
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
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
              args,
              noLogArgs,
            )}) @_Memo miss (${_since(started)})`,
          )
        }

        cache.get(ctx)!.set(cacheKey, res)
        return res
      }
    } as any
    ;(descriptor.value as any).dropCache = () => {
      logger.log(`${methodSignature} @_Memo.dropCache()`)
      cache.forEach(memoCache => memoCache.clear())
      cache.clear()
    }

    return descriptor
  }
