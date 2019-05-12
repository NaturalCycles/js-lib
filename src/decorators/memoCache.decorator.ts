// Based on:
// https://github.com/mgechev/memo-decorator/blob/master/index.ts
// http://decodize.com/blog/2012/08/27/javascript-memoization-caching-results-for-better-performance/
// http://inlehmansterms.net/2015/03/01/javascript-memoization/
/* tslint:disable:no-invalid-this */
import LRU from 'lru-cache'
import { getArgsSignature, getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer, MemoCache, MemoSerializer } from './memo.util'

export interface MemoCacheOpts {
  serializer?: MemoSerializer
  ttl?: number // in millis
  maxSize?: number
  logHit?: boolean
  logMiss?: boolean
  noLogArgs?: boolean
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

export const memoCache = (opts: MemoCacheOpts = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value

  opts.serializer = opts.serializer || jsonMemoSerializer
  const { maxSize, serializer, ttl, logHit, logMiss, noLogArgs } = opts

  const lruOpts: LRU.Options<string, any> = {
    max: maxSize || 100,
    maxAge: ttl || Infinity,
  }
  const cache = new LRUMemoCache(lruOpts)
  const keyStr = String(key)
  const methodSignature = getTargetMethodSignature(target, keyStr)

  descriptor.value = function (this: typeof target, ...args: any[]): any {
    const ctx = this
    const cacheKey = serializer!(args)

    if (cache.has(cacheKey)) {
      if (logHit) {
        console.log(`${methodSignature}(${getArgsSignature(args, noLogArgs)}) @memoCache hit`)
      }
      return cache.get(cacheKey)
    }

    const d = Date.now()

    const res: any = originalFn.apply(ctx, args)

    if (logMiss) {
      console.log(
        `${methodSignature}(${getArgsSignature(args, noLogArgs)}) @memoCache miss (${Date.now() -
          d} ms)`,
      )
    }

    cache.set(cacheKey, res)

    return res
  } as any
  ;(descriptor.value as any).dropCache = () => {
    console.log(`${methodSignature} @memoCache.dropCache()`)
    cache.clear()
  }

  return descriptor
}
