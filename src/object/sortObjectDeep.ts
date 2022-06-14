import { _isObject } from '..'

/**
 * based on: https://github.com/IndigoUnited/js-deep-sort-object
 */
export function _sortObjectDeep<T>(o: T): T {
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
        out[k as keyof T] = _sortObjectDeep(o[k as keyof T])
      })

    return out
  }

  return o
}
