import { _debounce, _throttle } from '..'
import { DebounceOptions, ThrottleOptions } from '../util/debounce'

export const Debounce = (wait: number, opt: DebounceOptions = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  const originalFn = descriptor.value
  descriptor.value = _debounce(originalFn as any, wait, opt)
  return descriptor
}

export const Throttle = (wait: number, opt: ThrottleOptions = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  const originalFn = descriptor.value
  descriptor.value = _throttle(originalFn as any, wait, opt)
  return descriptor
}
