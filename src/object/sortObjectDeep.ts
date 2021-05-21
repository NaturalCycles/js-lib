import { _isObject } from './object.util'

/**
 * based on: https://github.com/IndigoUnited/js-deep-sort-object
 */
export function _sortObjectDeep<T extends object>(o: T): T {
  // array
  if (Array.isArray(o)) {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return o.map(_sortObjectDeep) as any
  }

  if (_isObject(o)) {
    const out = {} as T

    Object.keys(o)
      .sort((a, b) => a.localeCompare(b))
      .forEach(k => {
        out[k] = _sortObjectDeep((o as any)[k])
      })

    return out
  }

  return o
}
