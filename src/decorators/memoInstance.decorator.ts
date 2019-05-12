import { getArgsSignature, getTargetMethodSignature } from './decorator.util'
import { jsonMemoSerializer } from './memo.util'

export interface MemoInstanceOpts {
  logHit?: boolean
  logMiss?: boolean
  noLogArgs?: boolean
}

/**
 * Like @memo, but cache is per instance (not `static` per class as @memo).
 * Should not leak memory due to usage of WeakMap (proven with unit test and `jest --detectLeaks`, if we can trust it).
 */
export const memoInstance = (opts: MemoInstanceOpts = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('Memoization can be applied only to methods')
  }

  const originalFn = descriptor.value
  // console.log({target, targetName: target.constructor.name, key, descriptor})

  // Map<ctx => Map<cacheKey, result>>
  //
  // Internal map is from cacheKey to result
  // External map is from ctx (instance of class) to Internal map
  // External map is Weak to not cause memory leaks, to allow ctx objects to be garbage collected
  const cache = new WeakMap<object, Map<any, any>>()
  const keyStr = String(key)
  const methodSignature = getTargetMethodSignature(target, keyStr)
  const { logHit, logMiss, noLogArgs } = opts

  descriptor.value = function (this: typeof target, ...args: any[]): any {
    const ctx = this

    const cacheKey = jsonMemoSerializer(args)

    if (!cache.has(ctx)) {
      cache.set(ctx, new Map())
    } else if (cache.get(ctx)!.has(cacheKey)) {
      if (logHit) {
        console.log(`${methodSignature}(${getArgsSignature(args, noLogArgs)}) @memoInstance hit`)
      }
      return cache.get(ctx)!.get(cacheKey)
    }

    const d = Date.now()

    const res: any = originalFn.apply(ctx, args)

    if (logMiss) {
      console.log(
        `${methodSignature}(${getArgsSignature(args, noLogArgs)}) @memoInstance miss (${Date.now() -
          d} ms)`,
      )
    }

    cache.get(ctx)!.set(cacheKey, res)

    return res
  } as any

  return descriptor
}
