import type { MemoOptions } from './memo.decorator'
import type { MemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface MemoizedFunction {
  cache: MemoCache
}

/**
 * Only supports Sync functions.
 * To support Async functions - use _memoFnAsync.
 * Technically, you can use it with Async functions, but it'll return the Promise without awaiting it.
 */
export function _memoFn<T extends (...args: any[]) => any>(
  fn: T,
  opt: MemoOptions = {},
): T & MemoizedFunction {
  const {
    logger = console,
    cacheErrors = true,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()

  const memoizedFn = function (this: any, ...args: any[]): T {
    const ctx = this
    const cacheKey = cacheKeyFn(args)
    let value: any

    if (cache.has(cacheKey)) {
      value = cache.get(cacheKey)

      if (value instanceof Error) {
        throw value
      }

      return value
    }

    try {
      value = fn.apply(ctx, args)

      try {
        cache.set(cacheKey, value)
      } catch (err) {
        logger.error(err)
      }

      return value
    } catch (err) {
      if (cacheErrors) {
        try {
          cache.set(cacheKey, err)
        } catch (err) {
          logger.error(err)
        }
      }

      throw err
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedFunction
}
