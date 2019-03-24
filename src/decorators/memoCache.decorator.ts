// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
/* tslint:disable:no-invalid-this */
import LRU from 'lru-cache'
import { jsonMemoSerializer, MemoCache, MemoSerializer } from './memo.util'

export interface MemoCacheOpts {
  serializer?: MemoSerializer
  ttl?: number // in millis
  maxSize?: number
}

class LRUMemoCache implements MemoCache {
  constructor (opt: LRU.Options<string, any>) {
    this.lru = new LRU<string, any>(opt)
  }

  private lru!: LRU<string, any>

  has (k: any): boolean {
    return this.lru.has(k)
  }

  get (k: any): any {
    return this.lru.get(k)
  }

  set (k: any, v: any): void {
    this.lru.set(k, v)
  }

  clear (): void {
    this.lru.reset()
  }
}

export const memoCache = (opts: MemoCacheOpts = {}) => (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value

  if (!opts.serializer) opts.serializer = jsonMemoSerializer

  const lruOpts: LRU.Options<string, any> = {
    max: opts.maxSize || 100,
    maxAge: opts.ttl || Infinity,
  }
  const cache = new LRUMemoCache(lruOpts)

  descriptor.value = function (...args: any[]): any {
    const cacheKey = opts.serializer!(args)

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const res: any = originalFn.apply(this, args)

    cache.set(cacheKey, res)

    return res
  }

  descriptor.value.dropCache = () => {
    console.log(`memo.dropCache (method=${key})`)
    cache.clear()
  }

  return descriptor
}
