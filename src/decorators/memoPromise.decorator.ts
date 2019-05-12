import { getArgsSignature, getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer, MapMemoCache, MemoCache } from './memo.util'

/* tslint:disable:promise-function-async */

export interface MemoPromiseOpts {
  /**
   * Cache resolved promises.
   * @default: true
   */
  cacheResolved: boolean

  /**
   * Cache rejected promises.
   * @default: true
   */
  cacheRejected: boolean

  noLogArgs?: boolean
  logHit?: boolean
  logMissResolved?: boolean
  logMissRejected?: boolean
}

const DEF_OPTS: MemoPromiseOpts = {
  cacheResolved: true,
  cacheRejected: true,
}

export const memoPromise = (_opts: Partial<MemoPromiseOpts> = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const { cacheResolved, cacheRejected, logHit, logMissResolved, logMissRejected, noLogArgs } = {
    ...DEF_OPTS,
    ..._opts,
  }

  const keyStr = String(key)
  const methodSignature = getTargetMethodSignature(target, keyStr)
  const cache: MemoCache = new MapMemoCache()

  const originalFn = descriptor.value

  descriptor.value = function (this: typeof target, ...args: any[]): Promise<any> {
    const ctx = this
    const cacheKey = jsonMemoSerializer(args)

    if (cache.has(cacheKey)) {
      if (logHit) {
        console.log(`${methodSignature}(${getArgsSignature(args, noLogArgs)}) @memoPromise hit`)
      }

      const res = cache.get(cacheKey)
      return res instanceof Error ? Promise.reject(res) : Promise.resolve(res)
    }

    const d = Date.now()

    return (originalFn.apply(ctx, args) as Promise<any>)
      .then(res => {
        // console.log('RESOLVED', res)
        if (logMissResolved) {
          console.log(
            `${methodSignature}(${getArgsSignature(
              args,
              noLogArgs,
            )}) @memoPromise miss resolved (${Date.now() - d} ms)`,
          )
        }

        if (cacheResolved) {
          cache.set(cacheKey, res)
        }

        return res
      })
      .catch(err => {
        // console.log('REJECTED', err)
        if (logMissRejected) {
          console.log(
            `${methodSignature}(${getArgsSignature(
              args,
              noLogArgs,
            )}) @memoPromise miss rejected (${Date.now() - d} ms)`,
          )
        }

        if (cacheRejected) {
          // We put it to cache as raw Error, not Promise.reject(err)
          // So, we'll need to check if it's instanceof Error to reject it or resolve
          // Wrap as Error if it's not Error
          cache.set(cacheKey, err instanceof Error ? err : new Error(err))
        }

        return Promise.reject(err)
      })
  } as any
  ;(descriptor.value as any).dropCache = () => {
    console.log(`${methodSignature} @memoPromise.dropCache()`)
    cache.clear()
  }

  return descriptor
}
