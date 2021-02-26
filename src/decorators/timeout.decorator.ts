import { pTimeout, PTimeoutOptions } from '../promise/pTimeout'

export function _Timeout(opt: PTimeoutOptions): MethodDecorator {
  return (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = pTimeout(originalFn as any, opt)
    return descriptor
  }
}
