import { getArgsSignature } from '../decorators/decorator.util'
import { MemoOpts } from '../decorators/memo.decorator'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from '../decorators/memo.util'
import { since } from './time.util'

interface MemoizedFunction {
  cache: MemoCache
}

export function memoFn<T extends (...args: any[]) => any> (
  fn: T,
  opts: MemoOpts = {},
): T & MemoizedFunction {
  const { logHit, logMiss, noLogArgs, cacheFactory, noCacheRejected, noCacheResolved } = {
    cacheFactory: () => new MapMemoCache(),
    ...opts,
  }

  const cache = cacheFactory()
  const awaitPromise = Boolean(noCacheRejected || noCacheResolved)
  const fnName = fn.name

  const memoizedFn = function (this: any, ...args: any[]): T {
    const ctx = this
    const cacheKey = jsonMemoSerializer(args)

    if (cache.has(cacheKey)) {
      if (logHit) {
        console.log(`${fnName}(${getArgsSignature(args, noLogArgs)}) memoFn hit`)
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
              `${fnName}(${getArgsSignature(args, noLogArgs)}) memoFn miss resolved (${since(
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
              `${fnName}(${getArgsSignature(args, noLogArgs)}) memoFn miss rejected (${since(
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
          `${fnName}(${getArgsSignature(args, noLogArgs)}) @memo miss (${since(started)})`,
        )
      }

      cache.set(cacheKey, res)
      return res
    }
  }

  Object.assign(memoizedFn, { cache })
  return memoizedFn as T & MemoizedFunction
}
