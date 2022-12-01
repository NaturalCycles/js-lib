import { _assert } from '../error/assert'
import type { PTimeoutOptions } from '../promise/pTimeout'
import { pTimeout } from '../promise/pTimeout'
import { _getMethodSignature } from './decorator.util'

// eslint-disable-next-line @typescript-eslint/naming-convention
export function _Timeout(opt: PTimeoutOptions): MethodDecorator {
  return (target, key, descriptor) => {
    _assert(typeof descriptor.value === 'function', '@_Timeout can be applied only to methods')

    const originalFn = descriptor.value
    const keyStr = String(key)

    descriptor.value = async function (this: typeof target, ...args: any[]) {
      const ctx = this
      opt.name ||= _getMethodSignature(ctx, keyStr)
      return await pTimeout(() => originalFn.apply(this, args), opt)
    } as any

    return descriptor
  }
}
