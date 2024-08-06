/**
 * based on: https://github.com/IndigoUnited/js-deep-sort-object
 */
export function _sortObjectDeep<T>(o: T): T {
  // array
  if (Array.isArray(o)) {
    return o.map(_sortObjectDeep) as any
  }

  if (o && typeof o === 'object') {
    const r = {} as T
    for (const k of Object.keys(o).sort((a, b) => a.localeCompare(b)) as (keyof T)[]) {
      r[k] = _sortObjectDeep(o[k])
    }
    return r
  }

  return o
}
