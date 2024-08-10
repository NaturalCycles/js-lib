import type { PRetryOptions } from '..'
import { pRetryFn } from '..'

// eslint-disable-next-line @typescript-eslint/naming-convention
export function _Retry(opt: PRetryOptions = {}): MethodDecorator {
  return (_target, _key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = pRetryFn(originalFn as any, opt)
    return descriptor
  }
}
