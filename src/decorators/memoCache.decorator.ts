// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
/* tslint:disable:no-invalid-this */
import LRU from 'lru-cache'

export type CacheKeyFn = (...args: any[]) => any

export interface MemoCacheOpts {
  cacheKeyFn?: CacheKeyFn
  ttl?: number // in millis
  maxSize?: number
}

const jsonCacheKey: CacheKeyFn = (...args) => JSON.stringify(args)

export const memoCache = (opts: MemoCacheOpts = {}) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value

  if (!opts.cacheKeyFn) opts.cacheKeyFn = jsonCacheKey

  const lruOpts: LRU.Options = {
    max: opts.maxSize || 100,
    maxAge: opts.ttl || Infinity,
  }
  const cache = new LRU<string, any>(lruOpts)
  let loggingEnabled = false

  descriptor.value = function (...args: any[]): any {
    const cacheKey = opts.cacheKeyFn!(args)

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)
      if (loggingEnabled) {
        console.log(`memo (method=${key}) returning value from cache: `, cacheKey, key)
      }
      return cached
    }

    const res: any = originalFn.apply(this, args)
    cache.set(cacheKey, res)
    return res
  }

  descriptor.value.dropCache = () => {
    console.log(`memo.dropCache (method=${key})`)
    cache.reset()
  }

  descriptor.value.setLogging = (enabled = true) => {
    loggingEnabled = enabled
    console.log(`memo.loggingEnabled=${enabled} (method=${key})`)
  }

  return descriptor
}
