import { pTimeout, PTimeoutOptions } from '../promise/pTimeout'

// eslint-disable-next-line @typescript-eslint/naming-convention
export function _Timeout(opt: PTimeoutOptions): MethodDecorator {
  return (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = pTimeout(originalFn as any, opt)
    return descriptor
  }
}
