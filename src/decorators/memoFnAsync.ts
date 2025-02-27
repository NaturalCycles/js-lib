import { AnyAsyncFunction, MaybeParameters, MISS } from '../types'
import type { AsyncMemoOptions } from './asyncMemo.decorator'
import type { AsyncMemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface MemoizedAsyncFunction {
  cache: AsyncMemoCache
}

/**
 * @experimental
 */
export function _memoFnAsync<T extends AnyAsyncFunction>(
  fn: T,
  opt: AsyncMemoOptions<T>,
): T & MemoizedAsyncFunction {
  const {
    logger = console,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()

  const memoizedFn = async function (this: any, ...args: MaybeParameters<T>): Promise<any> {
    const ctx = this
    const cacheKey = cacheKeyFn(args)
    let value: any

    try {
      value = await cache.get(cacheKey)
    } catch (err) {
      logger.error(err)
    }

    if (value !== MISS) {
      return value
    }

    value = await fn.apply(ctx, args)

    void (async () => {
      try {
        await cache.set(cacheKey, value)
      } catch (err) {
        logger.error(err)
      }
    })()

    return value
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedAsyncFunction
}
