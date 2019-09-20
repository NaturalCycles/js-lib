import { pRetry, PRetryOptions } from '..'

export function Retry(opt: PRetryOptions): MethodDecorator {
  return (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = pRetry(originalFn as any, opt)
    return descriptor
  }
}
