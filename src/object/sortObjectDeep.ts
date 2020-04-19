// based on: https://github.com/IndigoUnited/js-deep-sort-object
import { _isObject } from './object.util'

export function _sortObjectDeep<T extends object>(o: T): T {
  // array
  if (Array.isArray(o)) {
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
