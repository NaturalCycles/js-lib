import { _debounce, _throttle } from '..'
import { DebounceOptions, ThrottleOptions } from '../util/debounce'

export function Debounce(wait: number, opt: DebounceOptions = {}): MethodDecorator {
  return (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = _debounce(originalFn as any, wait, opt)
    return descriptor
  }
}

export function Throttle(wait: number, opt: ThrottleOptions = {}): MethodDecorator {
  return (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = _throttle(originalFn as any, wait, opt)
    return descriptor
  }
}
