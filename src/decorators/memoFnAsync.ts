import { _since } from '../time/time.util'
import type { AsyncMemoOptions } from './asyncMemo.decorator'
import { _getArgsSignature } from './decorator.util'
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
    logHit = false,
    logMiss = false,
    logArgs = true,
    logger = console,
    cacheRejections = true,
    cacheFactory = () => new MapMemoCache(),
    cacheKeyFn = jsonMemoSerializer,
  } = opt

  const cache = cacheFactory()
  const fnName = fn.name

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
      if (logHit) {
        logger.log(`${fnName}(${_getArgsSignature(args, logArgs)}) memoFnAsync hit`)
      }

      if (value instanceof Error) {
        throw value
      }

      return value
    }

    const started = Date.now()

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
    } finally {
      if (logMiss) {
        logger.log(
          `${fnName}(${_getArgsSignature(args, logArgs)}) memoFnAsync miss (${_since(started)})`,
        )
      }
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedAsyncFunction
}
