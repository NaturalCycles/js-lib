import { _since } from '../time/time.util'
import { _getArgsSignature } from './decorator.util'
import { MemoOptions } from './memo.decorator'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

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
    logHit = false,
    logMiss = false,
    logArgs = true,
    logger = console,
    cacheErrors = false,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()
  const fnName = fn.name

  const memoizedFn = function (this: any, ...args: any[]): T {
    const ctx = this
    const cacheKey = cacheKeyFn(args)

    if (cache.has(cacheKey)) {
      if (logHit) {
        logger.log(`${fnName}(${_getArgsSignature(args, logArgs)}) memoFn hit`)
      }

      return cache.get(cacheKey)
    }

    const started = Date.now()

    let value: any

    try {
      value = fn.apply(ctx, args)

      cache.set(cacheKey, value)

      return value
    } catch (err) {
      if (cacheErrors) {
        cache.set(cacheKey, err)
      }

      throw err
    } finally {
      if (logMiss) {
        logger.log(
          `${fnName}(${_getArgsSignature(args, logArgs)}) memoFn miss (${_since(started)})`,
        )
      }
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedFunction
}
