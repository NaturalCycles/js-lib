import { pRetry, PRetryOptions } from '..'

export const Retry = (opt: PRetryOptions): MethodDecorator => (target, key, descriptor) => {
  const originalFn = descriptor.value
  descriptor.value = pRetry(originalFn as any, opt)
  return descriptor
}
