import type { AsyncMemoOptions } from './asyncMemo.decorator'
import type { AsyncMemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface MemoizedAsyncFunction {
  cache: AsyncMemoCache
}

/**
 * Only supports Sync functions.
 * To support Async functions - use _memoFnAsync
 */
export function _memoFnAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  opt: AsyncMemoOptions = {},
): T & MemoizedAsyncFunction {
  const {
    logger = console,
    cacheRejections = true,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()

  const memoizedFn = async function (this: any, ...args: any[]): Promise<any> {
    const ctx = this
    const cacheKey = cacheKeyFn(args)
    let value: any

    try {
      value = await cache.get(cacheKey)
    } catch (err) {
      logger.error(err)
    }

    if (value !== undefined) {
      if (value instanceof Error) {
        throw value
      }

      return value
    }

    try {
      value = await fn.apply(ctx, args)

      void (async () => {
        try {
          await cache.set(cacheKey, value)
        } catch (err) {
          logger.error(err)
        }
      })()

      return value
    } catch (err) {
      if (cacheRejections) {
        void (async () => {
          try {
            await cache.set(cacheKey, err)
          } catch (err) {
            logger.error(err)
          }
        })()
      }

      throw err
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedAsyncFunction
}
