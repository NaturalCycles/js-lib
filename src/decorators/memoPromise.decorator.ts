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

  const opts = {
    ...DEF_OPTS,
    ..._opts,
  }

  const originalFn = descriptor.value
  // console.log(`${key} len: ${originalFn.length}`)

  const cache: MemoCache = new MapMemoCache()

  descriptor.value = function (this: any, ...args: any[]): Promise<any> {
    const ctx = this
    const cacheKey = jsonMemoSerializer(args)

    if (cache.has(cacheKey)) {
      const res = cache.get(cacheKey)
      return res instanceof Error ? Promise.reject(res) : Promise.resolve(res)
    }

    return (originalFn.apply(ctx, args) as Promise<any>)
      .then(res => {
        // console.log('RESOLVED', res)

        if (opts.cacheResolved) {
          cache.set(cacheKey, res)
        }

        return res
      })
      .catch(err => {
        // console.log('REJECTED', err)

        if (opts.cacheRejected) {
          // We put it to cache as raw Error, not Promise.reject(err)
          // So, we'll need to check if it's instanceof Error to reject it or resolve
          // Wrap as Error if it's not Error
          cache.set(cacheKey, err instanceof Error ? err : new Error(err))
        }

        return Promise.reject(err)
      })
  } as any
  ;(descriptor.value as any).dropCache = () => {
    console.log(`memoPromise.dropCache (method=${String(key)})`)
    cache.clear()
  }

  return descriptor
}
