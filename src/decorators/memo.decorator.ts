import type { CommonLogger } from '../log/commonLogger'
import { _since } from '../time/time.util'
import type { AnyObject } from '../types'
import { _getArgsSignature, _getMethodSignature, _getTargetMethodSignature } from './decorator.util'
import type { MemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface MemoOptions {
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
   * Defaults to true.
   * Set to false to skip caching errors.
   *
   * True will ensure "max 1 execution", but will "remember" errors.
   * False will allow >1 execution in case of errors.
   */
  cacheErrors?: boolean

  /**
   * Default to false
   */
  logHit?: boolean
  /**
   * Default to false
   */
  logMiss?: boolean

  /**
   * Defaults to true.
   * Set to false to skip logging method arguments.
   */
  logArgs?: boolean

  /**
   * Default to `console`
   */
  logger?: CommonLogger
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
 *
 * Doesn't support Async functions, use @_AsyncMemo instead!
 * (or, it will simply return the [unresolved] Promise further, without awaiting it)
 *
 * Based on:
 * https://github.com/mgechev/memo-decorator/blob/master/index.ts
 * http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
 * http://inlehmansterms.net/2015/03/01/javascript-memoization/
 * https://community.risingstack.com/the-worlds-fastest-javascript-memoization-library/
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
      logArgs = true,
      logger = console,
      cacheFactory = () => new MapMemoCache(),
      cacheKeyFn = jsonMemoSerializer,
      cacheErrors = true,
    } = opt

    const keyStr = String(key)
    const methodSignature = _getTargetMethodSignature(target, keyStr)

    descriptor.value = function (this: typeof target, ...args: any[]): any {
      const ctx = this
      const cacheKey = cacheKeyFn(args)
      let value: any

      if (!cache.has(ctx)) {
        cache.set(ctx, cacheFactory())
      } else if (cache.get(ctx)!.has(cacheKey)) {
        if (logHit) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(args, logArgs)}) @_Memo hit`,
          )
        }

        value = cache.get(ctx)!.get(cacheKey)

        if (value instanceof Error) {
          throw value
        }

        return value
      }

      const started = Date.now()

      try {
        value = originalFn.apply(ctx, args)

        try {
          cache.get(ctx)!.set(cacheKey, value)
        } catch (err) {
          logger.error(err)
        }

        return value
      } catch (err) {
        if (cacheErrors) {
          try {
            cache.get(ctx)!.set(cacheKey, err)
          } catch (err) {
            logger.error(err)
          }
        }

        throw err
      } finally {
        if (logMiss) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
              args,
              logArgs,
            )}) @_Memo miss (${_since(started)})`,
          )
        }
      }
    } as any
    ;(descriptor.value as any).dropCache = () => {
      logger.log(`${methodSignature} @_Memo.dropCache()`)
      cache.forEach(memoCache => memoCache.clear())
      cache.clear()
    }

    return descriptor
  }
