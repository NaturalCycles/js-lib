import type { AnyAsyncFunction, MaybeParameters } from '../types'
import { MISS } from '../types'
import type { AsyncMemoOptions } from './asyncMemo.decorator'
import type { AsyncMemoCache } from './memo.util'
import { jsonMemoSerializer, MapMemoCache } from './memo.util'

export interface MemoizedAsyncFunction {
  cache: AsyncMemoCache
}

/**
 * @experimental
 */
export function _memoFnAsync<FN extends AnyAsyncFunction>(
  fn: FN,
  opt: AsyncMemoOptions<FN>,
): FN & MemoizedAsyncFunction {
  const {
    logger = console,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()

  const memoizedFn = async function (this: any, ...args: MaybeParameters<FN>): Promise<any> {
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
  return memoizedFn as FN & MemoizedAsyncFunction
}
