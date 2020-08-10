import { NotVoid, ObjectIterator, ObjectKVIterator, PropertyPath } from '../lodash.types'
import { StringMap } from '../types'

/**
 * Returns clone of `obj` with only `props` preserved.
 * Opposite of Omit.
 */
export function _pick<T extends object, K extends keyof T>(
  obj: T,
  props: readonly K[],
  mutate = false,
): T {
  if (mutate) {
    // Start as original object (mutable), DELETE properties that are not whitelisted
    return Object.keys(obj).reduce((r, prop) => {
      if (!props.includes(prop as K)) delete r[prop]
      return r
    }, obj)
  } else {
    // Start as empty object, pick/add needed properties
    return props.reduce((r, prop) => {
      if (prop in obj) r[prop] = obj[prop]
      return r
    }, {} as T)
  }
}

/**
 * Returns clone of `obj` with `props` omitted.
 * Opposite of Pick.
 */
export function _omit<T extends object, K extends keyof T>(
  obj: T,
  props: readonly K[],
  mutate = false,
): T {
  return props.reduce(
    (r, prop) => {
      delete r[prop]
      return r
    },
    mutate ? obj : { ...obj },
  )
}

/**
 * Returns object with filtered keys from `props` array.
 * E.g:
 * _mask({...}, [
 *  'account.id',
 *  'account.updated',
 * ])
 */
export function _mask<T extends object>(obj: T, props: string[], mutate = false): T {
  return props.reduce(
    (r, prop) => {
      _unset(r, prop)
      return r
    },
    mutate ? obj : _deepCopy(obj),
  )
}

/**
 * Removes "falsy" values from the object.
 */
export function _filterFalsyValues<T extends object>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => !!v, mutate)
}

/**
 * Removes values from the object that are `null` or `undefined`.
 */
export function _filterUndefinedValues<T extends object>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => v !== undefined && v !== null, mutate)
}

/**
 * Returns clone of `obj` without properties that does not pass `predicate`.
 * Allows filtering by both key and value.
 */
export function _filterObject<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: any) => boolean,
  mutate = false,
): T {
  return Object.keys(obj).reduce(
    (r, k) => {
      if (!predicate(k as keyof T, r[k])) delete r[k]
      return r
    },
    mutate ? obj : { ...obj },
  )
}

/**
 * var users = {
 *  'fred':    { 'user': 'fred',    'age': 40 },
 *  'pebbles': { 'user': 'pebbles', 'age': 1 }
 * }
 *
 * _.mapValues(users, function(o) { return o.age; });
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 *
 * // The `_.property` iteratee shorthand.
 * _.mapValues(users, 'age')
 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
 */
export function _mapValues<T extends object>(
  obj: T,
  predicate: ObjectIterator<T, NotVoid> | string,
  mutate = false,
): T {
  const cb: ObjectIterator<T, NotVoid> =
    typeof predicate === 'function' ? predicate : v => v[predicate]

  return Object.entries(obj).reduce(
    (map, [k, v]) => {
      map[k] = cb(v, k, obj)
      return map
    },
    mutate ? obj : ({} as T),
  )
}

/**
 * _.mapKeys({ 'a': 1, 'b': 2 }, (value, key) => key + value)
 * // => { 'a1': 1, 'b2': 2 }
 *
 * Does not support `mutate` flag currently.
 */
export function _mapKeys<T extends object>(
  obj: T,
  predicate: ObjectIterator<T, string>,
): StringMap<T[keyof T]> {
  return Object.entries(obj).reduce((map, [k, v]) => {
    map[String(predicate(v, k, obj))] = v
    return map
  }, {} as StringMap<T[keyof T]>)
}

type KeyValueTuple<K, V> = [K, V]

/**
 * Maps object through predicate - a function that receives (k, v, obj)
 * k - key
 * v - value
 * obj - whole object
 *
 * Order of arguments in the predicate is different form _mapValues / _mapKeys!
 *
 * Predicate should return a _tuple_ [0, 1], where:
 * 0 - key of returned object (string)
 * 1 - value of returned object (any)
 *
 * If predicate returns falsy value (e.g undefined), or a tuple where key (first item) is falsy - then such key/value pair is ignored (filtered out).
 *
 * Non-string keys are passed via String(...)
 */
export function _mapObject<T extends object, TResult>(
  obj: T,
  predicate: ObjectKVIterator<T, KeyValueTuple<any, any>>,
): { [P in keyof T]: TResult } {
  return Object.entries(obj).reduce((map, [k, v]) => {
    const r = predicate(k, v, obj)
    if (r?.[0]) {
      map[String(r[0])] = r[1]
    }
    return map
  }, {} as { [P in keyof T]: TResult })
}

export function _objectNullValuesToUndefined<T extends object>(obj: T, mutate = false): T {
  return _mapValues(obj, v => (v === null ? undefined : v), mutate)
}

/**
 * Deep copy object (by json parse/stringify, since it has unbeatable performance+simplicity combo).
 */
export function _deepCopy<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}

/**
 * Returns true if item is Object, not null and not Array.
 */
export function _isObject(item: any): item is object {
  return (typeof item === 'object' && item !== null && !Array.isArray(item)) || false
}

export function _isPrimitive(v: any): v is null | undefined | number | boolean | string {
  return (
    v === null ||
    v === undefined ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'string'
  )
}

export function _isEmptyObject(obj: any): boolean {
  return obj && obj.constructor === Object && Object.keys(obj).length === 0
}

/**
 * Recursively merges own and inherited enumerable properties of source
 * objects into the destination object, skipping source properties that resolve
 * to `undefined`. Array and plain object properties are merged recursively.
 * Other objects and value types are overridden by assignment. Source objects
 * are applied from left to right. Subsequent sources overwrite property
 * assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @category Object
 * @param target The destination object.
 * @param sources The source objects.
 * @returns Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 *
 * Based on: https://gist.github.com/Salakar/1d7137de9cb8b704e48a
 */
export function _merge<T extends object>(target: T, ...sources: any[]): T {
  sources.forEach(source => {
    if (_isObject(source)) {
      Object.keys(source).forEach(key => {
        if (_isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          _merge(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      })
    }
  })

  return target
}

/**
 * Trims all object VALUES deeply.
 * Doesn't touch object KEYS.
 * Mutates.
 */
export function _deepTrim<T extends object | string>(o: T): T {
  if (!o) return o

  if (typeof o === 'string') {
    return o.trim() as T
  } else if (typeof o === 'object') {
    Object.keys(o).forEach(k => {
      o[k] = _deepTrim(o[k])
    })
  }

  return o
}

// from: https://github.com/jonschlinkert/unset-value
// mutates obj
export function _unset<T extends object>(obj: T, prop: string): void {
  if (!_isObject(obj)) {
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
  while (segs.length && _isObject(obj)) {
    const k = (prop = segs.shift()!)
    obj = obj[k]
  }
  if (!_isObject(obj)) return
  delete obj[last!]
}

export function _getKeyByValue<T extends object = any>(object: any, value: any): T | undefined {
  if (!_isObject(object)) return
  return Object.keys(object).find(k => object[k] === value) as any
}

export function _invert<T extends object>(o: any): T {
  const inv = {} as T
  Object.keys(o).forEach(k => {
    inv[o[k]] = k
  })
  return inv
}

export function _invertMap<K, V>(m: ReadonlyMap<K, V>): Map<V, K> {
  const inv = new Map<V, K>()
  m.forEach((v, k) => inv.set(v, k))
  return inv
}

/**
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 *
 * @param obj The object to query.
 * @param path The path of the property to get.
 * @param def The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 */
export function _get<T extends object>(obj = {} as T, path = '', def?: any): any {
  const res = path
    .replace(/\[([^\]]+)]/g, '.$1')
    .split('.')
    .reduce((o, p) => o[p], obj)

  return res === undefined ? def : res
}

/**
 * Sets the value at path of object. If a portion of path doesn’t exist it’s created. Arrays are created for
 * missing index properties while objects are created for all other missing properties. Use _.setWith to
 * customize path creation.
 *
 * @param obj The object to modify.
 * @param path The path of the property to set.
 * @param value The value to set.
 * @return Returns object.
 *
 * Based on: https://stackoverflow.com/a/54733755/4919972
 */
export function _set<IN extends object, OUT = IN>(obj: IN, path: PropertyPath, value?: any): OUT {
  if (!obj || Object(obj) !== obj || !path) return obj as any // When obj is not an object

  // If not yet an array, get the keys from the string-path
  if (!Array.isArray(path)) {
    path = String(path).match(/[^.[\]]+/g) || []
  } else if (!path.length) {
    return obj as any
  }

  path.slice(0, -1).reduce(
    (
      a,
      c,
      i, // Iterate all of them except the last one
    ) =>
      Object(a[c]) === a[c] // Does the key exist and is its value an object?
        ? // Yes: then follow that path
          a[c]
        : // No: create the key. Is the next key a potential array-index?
          (a[c] =
            Math.abs(path[i + 1]) >> 0 === +path[i + 1] // tslint:disable-line
              ? [] // Yes: assign a new array object
              : {}), // No: assign a new plain object
    obj,
  )[path[path.length - 1]] = value // Finally assign the value to the last key

  return obj as any // Return the top-level object to allow chaining
}

/**
 * Checks if `path` is a direct property of `object` (not null, not undefined).
 *
 * @category Object
 * @param obj The object to query.
 * @param path The path to check.
 * @returns Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': { 'c': 3 } } };
 * var other = _.create({ 'a': _.create({ 'b': _.create({ 'c': 3 }) }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b.c');
 * // => true
 *
 * _.has(object, ['a', 'b', 'c']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
export function _has<T extends object>(obj: T, path?: string): boolean {
  const v = _get(obj, path)
  return v !== undefined && v !== null
}

/**
 * Needed due to https://github.com/microsoft/TypeScript/issues/13778
 * Only affects typings, no runtime effect.
 */
export function _stringMapValues<T>(m: StringMap<T>): T[] {
  return Object.values(m) as T[]
}

export function _stringMapEntries<T>(m: StringMap<T>): [string, T][] {
  return Object.entries(m) as [string, T][]
}
