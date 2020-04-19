import { _since } from '..'
import { _getArgsSignature } from './decorator.util'
import { MemoOptions } from './memo.decorator'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

export interface MemoizedFunction {
  cache: MemoCache
}

export function _memoFn<T extends (...args: any[]) => any>(
  fn: T,
  opt: MemoOptions = {},
): T & MemoizedFunction {
  const { logHit, logMiss, noLogArgs, cacheFactory, noCacheRejected, noCacheResolved } = {
    cacheFactory: () => new MapMemoCache(),
    ...opt,
  }

  const cache = cacheFactory()
  const awaitPromise = Boolean(noCacheRejected || noCacheResolved)
  const fnName = fn.name

  const memoizedFn = function (this: any, ...args: any[]): T {
    const ctx = this
    const cacheKey = jsonMemoSerializer(args)

    if (cache.has(cacheKey)) {
      if (logHit) {
        console.log(`${fnName}(${_getArgsSignature(args, noLogArgs)}) memoFn hit`)
      }

      const res = cache.get(cacheKey)

      if (awaitPromise) {
        return res instanceof Error ? (Promise.reject(res) as any) : Promise.resolve(res)
      } else {
        return res
      }
    }

    const started = Date.now()

    const res: any = fn.apply(ctx, args)

    if (awaitPromise) {
      return (res as Promise<any>)
        .then(res => {
          // console.log('RESOLVED', res)
          if (logMiss) {
            console.log(
              `${fnName}(${_getArgsSignature(args, noLogArgs)}) memoFn miss resolved (${_since(
                started,
              )})`,
            )
          }

          if (!noCacheResolved) {
            cache.set(cacheKey, res)
          }

          return res
        })
        .catch(err => {
          // console.log('REJECTED', err)
          if (logMiss) {
            console.log(
              `${fnName}(${_getArgsSignature(args, noLogArgs)}) memoFn miss rejected (${_since(
                started,
              )})`,
            )
          }

          if (!noCacheRejected) {
            // We put it to cache as raw Error, not Promise.reject(err)
            // So, we'll need to check if it's instanceof Error to reject it or resolve
            // Wrap as Error if it's not Error
            cache.set(cacheKey, err instanceof Error ? err : new Error(err))
          }

          return Promise.reject(err)
        }) as any
    } else {
      if (logMiss) {
        console.log(
          `${fnName}(${_getArgsSignature(args, noLogArgs)}) @memo miss (${_since(started)})`,
        )
      }

      cache.set(cacheKey, res)
      return res
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedFunction
}
