import { StringMap } from '../types'

/**
 * Returns clone of `obj` with only `fields` preserved.
 */
export function pick<T, K extends keyof T> (
  obj: T,
  fields: readonly K[] = [],
  initialObject: Partial<T> = {},
): Pick<T, K> {
  if (!obj || !fields || !fields.length) return obj

  const o = initialObject as Pick<T, K>

  fields.forEach(k => {
    if (k in obj) o[k] = obj[k]
  })

  return o
}

/**
 * Removes "falsy" values from the object.
 */
export function filterFalsyValues<T> (_obj: T, mutate = false): T {
  return filterObject(_obj, (k, v) => !!v, mutate)
}

export function filterEmptyStringValues<T> (_obj: T, mutate = false): T {
  return filterObject(_obj, (k, v) => v !== '', mutate)
}

export function filterUndefinedValues<T> (_obj: T, mutate = false): T {
  return filterObject(_obj, (k, v) => v !== undefined && v !== null, mutate) as any
}

/**
 * Returns clone of `obj` without properties that does not pass `predicate`.
 * Allows filtering by both key and value.
 */
export function filterObject<T> (
  _obj: T,
  predicate: (key: keyof T, value: any) => boolean,
  mutate = false,
): T {
  if (!isObject(_obj)) return _obj

  const o: T = mutate ? _obj : { ..._obj }

  Object.keys(o).forEach(k => {
    const keep = predicate(k as keyof T, o[k])
    if (!keep) delete o[k]
  })

  return o
}

export function transformObject<T> (
  _obj: T,
  transformFn: (key: any, value: any) => any,
  mutate = false,
): T {
  if (!isObject(_obj)) return _obj

  const o: T = mutate ? _obj : { ...(_obj as any) }

  Object.keys(o).forEach(k => {
    o[k] = transformFn(k, o[k])
  })

  return o
}

export function objectNullValuesToUndefined<T> (_obj: T, mutate = false): T {
  return transformObject(
    _obj,
    (k, v) => {
      if (v === null) return undefined
      return v
    },
    mutate,
  )
}

export function deepEquals (a: object, b: object): boolean {
  return JSON.stringify(sortObjectDeep(a)) === JSON.stringify(sortObjectDeep(b))
}

/**
 * Deep copy object (by json parse/stringify).
 */
export function deepCopy<T> (o: T): T {
  return JSON.parse(JSON.stringify(o))
}

export function isObject (item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null) || false
}

export function isPrimitive (v: any): boolean {
  return (
    v === null ||
    v === undefined ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'string'
  )
}

export function isEmptyObject (obj: any): boolean {
  return obj && obj.constructor === Object && Object.keys(obj).length === 0
}

// from: https://gist.github.com/Salakar/1d7137de9cb8b704e48a
export function mergeDeep (target: any, source: any): any {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    })
  }
  return target
}

/**
 * Mutates
 */
export function deepTrim (o: any): any {
  if (!o) return o

  if (typeof o === 'string') {
    return o.trim()
  } else if (typeof o === 'object') {
    Object.keys(o).forEach(k => {
      o[k] = deepTrim(o[k])
    })
  }

  return o
}

function defaultSortFn (a: any, b: any): number {
  return a.localeCompare(b)
}

// based on: https://github.com/IndigoUnited/js-deep-sort-object
export function sortObjectDeep<T> (o: T): T {
  // array
  if (Array.isArray(o)) {
    return o.map(i => sortObjectDeep(i)) as any
  }

  if (isObject(o)) {
    const out: any = {}

    Object.keys(o)
      .sort((a, b) => defaultSortFn(a, b))
      .forEach(k => {
        out[k] = sortObjectDeep((o as any)[k])
      })

    return out
  }

  return o
}

// from: https://github.com/jonschlinkert/unset-value
// mutates obj
export function unsetValue (obj: any, prop: string): void {
  if (!isObject(obj)) {
    return
  }
  if (obj.hasOwnProperty(prop)) {
    delete obj[prop]
    return
  }

  const segs = prop.split('.')
  let last = segs.pop()
  while (segs.length && segs[segs.length - 1].slice(-1) === '\\') {
    last = segs.pop()!.slice(0, -1) + '.' + last
  }
  while (segs.length && isObject(obj)) {
    const k = (prop = segs.shift()!)
    obj = obj[k]
  }
  if (!isObject(obj)) return
  delete obj[last!]
}

/**
 * Returns object with filtered keys from "exclude" array.
 * E.g:
 * mask({...}, [
 *  'account.id',
 *  'account.updated',
 * ])
 *
 * Pass deepCopy if you want to protect the whole object (not just first level) from mutation.
 */
export function mask<T extends object> (_o: T, exclude: string[], _deepCopy = false): T {
  let o = { ..._o }
  if (_deepCopy) o = deepCopy(o)

  exclude.forEach(e => {
    // eval(`delete o.${e}`)
    unsetValue(o, e)
  })
  return o as T
}

export function getKeyByValue<T = any> (object: any, value: any): T | undefined {
  if (!isObject(object)) return
  return Object.keys(object).find(k => object[k] === value) as any
}

export function invertObject<T> (o: any): T {
  const inv: any = {}
  Object.keys(o).forEach(k => {
    inv[o[k]] = k
  })
  return inv
}

export function invertMap<K, V> (m: Map<K, V>): Map<V, K> {
  const inv = new Map<V, K>()
  m.forEach((v, k) => inv.set(v, k))
  return inv
}

export function by<T> (items: T[] = [], by: string): StringMap<T> {
  return items.reduce((r, item) => {
    if (item[by]) r[item[by]] = item
    return r
  }, {})
}

/**
 * Does Object.freeze recursively for given object.
 *
 * Based on: https://github.com/substack/deep-freeze/blob/master/index.js
 */
export function deepFreeze (o: any): void {
  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop])
    }
  })

  return o
}
