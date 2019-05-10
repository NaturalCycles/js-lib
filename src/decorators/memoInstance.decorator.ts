import { jsonMemoSerializer } from './memo.util'

/**
 * Like @memo, but cache is per instance (not `static` per class as @memo).
 * Should not leak memory due to usage of WeakMap (proven with unit test and `jest --detectLeaks`, if we can trust it).
 */
export const memoInstance = (): MethodDecorator => (target, key, descriptor) => {
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

  descriptor.value = function (this: typeof target, ...args: any[]): any {
    const ctx = this

    const cacheKey = jsonMemoSerializer(args)

    if (!cache.has(ctx)) {
      cache.set(ctx, new Map())
    } else if (cache.get(ctx)!.has(cacheKey)) {
      // console.log('hit', cacheKey)
      return cache.get(ctx)!.get(cacheKey)
    }

    const res: any = originalFn.apply(ctx, args)

    cache.get(ctx)!.set(cacheKey, res)
    // console.log('miss', cacheKey)

    return res
  } as any

  return descriptor
}
