import type { AnyFunction, MaybeParameters } from '../types'
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
 *
 * @experimental
 */
export function _memoFn<FN extends AnyFunction>(
  fn: FN,
  opt: MemoOptions<FN> = {},
): FN & MemoizedFunction {
  const {
    logger = console,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()

  const memoizedFn = function (this: any, ...args: MaybeParameters<FN>): FN {
    const ctx = this
    const cacheKey = cacheKeyFn(args)

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const value = fn.apply(ctx, args)

    try {
      cache.set(cacheKey, value)
    } catch (err) {
      logger.error(err)
    }

    return value
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as FN & MemoizedFunction
}
