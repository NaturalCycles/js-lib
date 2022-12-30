import type { CommonLogger } from '../log/commonLogger'
import { _since } from '../time/time.util'
import type { AnyObject } from '../types'
import { _getArgsSignature, _getMethodSignature, _getTargetMethodSignature } from './decorator.util'
import type { AsyncMemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface AsyncMemoOptions {
  /**
   * Provide a custom implementation of MemoCache.
   * Function that creates an instance of `MemoCache`.
   * e.g LRUMemoCache from `@naturalcycles/nodejs-lib`.
   */
  cacheFactory?: () => AsyncMemoCache

  /**
   * Provide a custom implementation of CacheKey function.
   */
  cacheKeyFn?: (args: any[]) => any

  /**
   * Default true.
   *
   * Set to `false` to skip caching rejected promises (errors).
   *
   * True will ensure "max 1 execution", but will "remember" rejection.
   * False will allow >1 execution in case of errors.
   */
  cacheRejections?: boolean

  /**
   * Default to false
   */
  logHit?: boolean

  /**
   * Default to false
   */
  logMiss?: boolean

  /**
   * Set to `false` to skip logging method arguments.
   *
   * Defaults to true.
   */
  logArgs?: boolean

  /**
   * Default to `console`
   */
  logger?: CommonLogger
}

/**
 * Like @_Memo, but allowing async MemoCache implementation.
 *
 * Method CANNOT return `undefined`, as undefined will always be treated as cache MISS and retried.
 * Return `null` instead (it'll be cached).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const _AsyncMemo =
  (opt: AsyncMemoOptions = {}): MethodDecorator =>
  (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError('Memoization can be applied only to methods')
    }

    const originalFn = descriptor.value

    // Map from "instance" of the Class where @_AsyncMemo is applied to AsyncMemoCache instance.
    const cache = new Map<AnyObject, AsyncMemoCache>()

    const {
      logHit = false,
      logMiss = false,
      logArgs = true,
      logger = console,
      cacheFactory = () => new MapMemoCache(),
      cacheKeyFn = jsonMemoSerializer,
      cacheRejections = true,
    } = opt

    const keyStr = String(key)
    const methodSignature = _getTargetMethodSignature(target, keyStr)

    descriptor.value = async function (this: typeof target, ...args: any[]): Promise<any> {
      const ctx = this

      const cacheKey = cacheKeyFn(args)

      if (!cache.has(ctx)) {
        cache.set(ctx, cacheFactory())
        // here, no need to check the cache. It's definitely a miss, because the cacheLayers is just created
        // UPD: no! AsyncMemo supports "persistent caches" (e.g Database-backed cache)
      }

      let value: any

      try {
        value = await cache.get(ctx)!.get(cacheKey)
      } catch (err) {
        // log error, but don't throw, treat it as a "miss"
        logger.error(err)
      }

      if (value !== undefined) {
        // hit!
        if (logHit) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
              args,
              logArgs,
            )}) @_AsyncMemo hit`,
          )
        }

        if (value instanceof Error) {
          throw value
        }

        return value
      }

      // Here we know it's a MISS, let's execute the real method
      const started = Date.now()

      try {
        value = await originalFn.apply(ctx, args)

        // Save the value in the Cache, without awaiting it
        // This is to support both sync and async functions
        void (async () => {
          try {
            await cache.get(ctx)!.set(cacheKey, value)
          } catch (err) {
            // log and ignore the error
            logger.error(err)
          }
        })()

        return value
      } catch (err) {
        if (cacheRejections) {
          // We put it to cache as raw Error, not Promise.reject(err)
          // This is to support both sync and async functions
          void (async () => {
            try {
              await cache.get(ctx)!.set(cacheKey, err)
            } catch (err) {
              // log and ignore the error
              logger.error(err)
            }
          })()
        }

        throw err
      } finally {
        if (logMiss) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
              args,
              logArgs,
            )}) @_AsyncMemo miss (${_since(started)})`,
          )
        }
      }
    } as any
    ;(descriptor.value as any).dropCache = async () => {
      logger.log(`${methodSignature} @_AsyncMemo.dropCache()`)
      try {
        await Promise.all([...cache.values()].map(c => c.clear()))
        cache.clear()
      } catch (err) {
        logger.error(err)
      }
    }

    return descriptor
  }
