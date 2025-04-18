import { _mapObject, _mapValues } from './object/object.util.js'
import type { AnyFunction, AnyObject, Lazy } from './types.js'
import { SKIP } from './types.js'

/**
 * const value = lazyValue(() => expensiveComputation())
 *
 * value() // calls expensiveComputation() once
 * value() // returns cached result
 * value() // returns cached result
 *
 * Based on: https://github.com/sindresorhus/lazy-value
 */
export function _lazyValue<T>(fn: () => T): Lazy<T> {
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
  const define = (value: any): void => {
    Object.defineProperty(obj, propertyName, { value, enumerable: true, writable: true })
  }

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

/**
 * Same as Object.defineProperty, but with better (least restricting) defaults.
 *
 * Defaults are:
 * writable: true
 * configurable: true
 * enumerable: true
 * value: existing obj[prop] value
 *
 * Original defaults:
 * writable: false
 * configurable: false
 * enumerable: false
 * value: existing obj[prop] value
 *
 */
export function _defineProperty<T extends AnyObject>(
  obj: T,
  prop: keyof T,
  pd: PropertyDescriptor,
): T {
  return Object.defineProperty(obj, prop, {
    writable: true,
    configurable: true,
    enumerable: true,
    // value: obj[prop], // existing value is already kept by default
    ...pd,
  })
}

/**
 * Object.defineProperties with better defaults.
 * See _defineProperty for exact defaults definition.
 */
export function _defineProps<T extends AnyObject>(
  obj: T,
  props: Partial<Record<keyof T, PropertyDescriptor>>,
): T {
  return Object.defineProperties(
    obj,
    _mapValues(props, (_k, pd) => ({
      writable: true,
      configurable: true,
      enumerable: true,
      // value: obj[k], // existing value is already kept by default
      ...pd,
    })),
  )
}

/**
 * Like _defineProps, but skips props with nullish values.
 */
export function _defineNonNullishProps<T extends AnyObject>(
  obj: T,
  props: Partial<Record<keyof T, PropertyDescriptor>>,
): T {
  return _defineProps(
    obj,
    _mapObject(props, (k, pd) => {
      if (pd.value === null || pd.value === undefined) return SKIP
      return [k as string, pd]
    }),
  )
}
