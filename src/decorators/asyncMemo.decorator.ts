import { _since } from '../time/time.util'
import { Merge } from '../typeFest'
import { AnyObject } from '../types'
import { _getArgsSignature, _getMethodSignature, _getTargetMethodSignature } from './decorator.util'
import { MemoOptions } from './memo.decorator'
import { AsyncMemoCache, jsonMemoSerializer } from './memo.util'

export type AsyncMemoOptions = Merge<
  MemoOptions,
  {
    /**
     * Provide a custom implementation of MemoCache.
     * Function that creates an instance of `MemoCache`.
     * e.g LRUMemoCache from `@naturalcycles/nodejs-lib`.
     *
     * It's an ARRAY of Caches, to allow multiple layers of Cache.
     * It will check it one by one, starting from the first.
     * HIT will be returned immediately, MISS will go one level deeper, or returned (if the end of the Cache stack is reached).
     */
    cacheFactory: () => AsyncMemoCache[]
  }
>

/**
 * Like @_Memo, but allowing async MemoCache implementation.
 *
 * Method CANNOT return `undefined`, as undefined will always be treated as cache MISS and retried.
 * Return `null` instead (it'll be cached).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const _AsyncMemo =
  (opt: AsyncMemoOptions): MethodDecorator =>
  (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new TypeError('Memoization can be applied only to methods')
    }

    const originalFn = descriptor.value

    // Map from "instance" of the Class where @_AsyncMemo is applied to AsyncMemoCache instance.
    const cache = new Map<AnyObject, AsyncMemoCache[]>()

    const {
      logHit = false,
      logMiss = false,
      noLogArgs = false,
      logger = console,
      cacheFactory,
      cacheKeyFn = jsonMemoSerializer,
      noCacheRejected = false,
      noCacheResolved = false,
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
        for await (const cacheLayer of cache.get(ctx)!) {
          value = await cacheLayer.get(cacheKey)
          if (value !== undefined) {
            // it's a hit!
            break
          }
        }
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
              noLogArgs,
            )}) @_AsyncMemo hit`,
          )
        }

        return value instanceof Error ? Promise.reject(value) : Promise.resolve(value)
      }

      // Here we know it's a MISS, let's execute the real method
      const started = Date.now()

      try {
        value = await originalFn.apply(ctx, args)

        if (!noCacheResolved) {
          Promise.all(cache.get(ctx)!.map(cacheLayer => cacheLayer.set(cacheKey, value))).catch(
            err => {
              // log and ignore the error
              logger.error(err)
            },
          )
        }

        return value
      } catch (err) {
        if (!noCacheRejected) {
          // We put it to cache as raw Error, not Promise.reject(err)
          Promise.all(cache.get(ctx)!.map(cacheLayer => cacheLayer.set(cacheKey, err))).catch(
            err => {
              // log and ignore the error
              logger.error(err)
            },
          )
        }

        throw err
      } finally {
        if (logMiss) {
          logger.log(
            `${_getMethodSignature(ctx, keyStr)}(${_getArgsSignature(
              args,
              noLogArgs,
            )}) @_AsyncMemo miss (${_since(started)})`,
          )
        }
      }
    } as any
    ;(descriptor.value as any).dropCache = async () => {
      logger.log(`${methodSignature} @_AsyncMemo.dropCache()`)
      try {
        await Promise.all([...cache.values()].flatMap(c => c.map(c => c.clear())))
        cache.clear()
      } catch (err) {
        logger.error(err)
      }
    }

    return descriptor
  }
