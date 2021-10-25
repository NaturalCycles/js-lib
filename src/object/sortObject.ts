import { _omit, AnyObject } from '../index'

/**
 * Returns new object with keys sorder in the given order.
 * All keys that are not listed in `keyOrder` go last.
 * Does not mutate original object.
 */
export function _sortObject<T extends AnyObject>(obj: T, keyOrder: (keyof T)[]): T {
  const r = {} as T

  keyOrder.forEach(key => {
    if (key in obj) {
      r[key] = obj[key]
    }
  })

  Object.entries(_omit(obj, keyOrder)).forEach(([k, v]) => {
    r[k as keyof T] = v
  })

  return r
}
