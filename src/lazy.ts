import { AnyFunction, AnyObject } from './types'

/**
 * const value = lazyValue(() => expensiveComputation())
 *
 * value() // calls expensiveComputation() once
 * value() // returns cached result
 * value() // returns cached result
 *
 * Based on: https://github.com/sindresorhus/lazy-value
 */
export function _lazyValue<T extends AnyFunction>(fn: T): T {
  let isCalled = false
  let result: any

  return (() => {
    if (!isCalled) {
      isCalled = true
      result = fn()
    }

    return result
  }) as any
}

/**
 * interface Obj {
 *   v: number
 * }
 *
 * const obj = {} as Obj
 *
 * _defineLazyProperty(obj, 'v', () => expensiveComputation())
 * obj.v // runs expensiveComputation() once
 * obj.v // cached value
 * obj.v // cached value
 *
 * Based on: https://github.com/sindresorhus/define-lazy-prop
 */
export function _defineLazyProperty<OBJ extends AnyObject>(
  obj: OBJ,
  propertyName: keyof OBJ,
  fn: AnyFunction,
): OBJ {
  const define = (value: any) =>
    Object.defineProperty(obj, propertyName, { value, enumerable: true, writable: true })

  Object.defineProperty(obj, propertyName, {
    configurable: true,
    enumerable: true,
    get() {
      const result = fn()
      define(result)
      return result
    },
    set(value) {
      define(value)
    },
  })

  return obj
}

/**
 * Like _defineLazyProperty, but allows to define multiple props at once.
 */
export function _defineLazyProps<OBJ extends AnyObject>(
  obj: OBJ,
  props: Partial<Record<keyof OBJ, AnyFunction>>,
): OBJ {
  Object.entries(props).forEach(([k, fn]) => _defineLazyProperty(obj, k, fn!))
  return obj
}
