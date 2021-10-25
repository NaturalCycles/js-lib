import { PropertyPath } from '../lodash.types'
import { AnyObject, ObjectMapper, ObjectPredicate, StringMap, ValueOf } from '../types'

/**
 * Returns clone of `obj` with only `props` preserved.
 * Opposite of Omit.
 */
export function _pick<T extends AnyObject, K extends keyof T>(
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
export function _omit<T extends AnyObject, K extends keyof T>(
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
export function _mask<T extends AnyObject>(obj: T, props: string[], mutate = false): T {
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
export function _filterFalsyValues<T extends AnyObject>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => !!v, mutate)
}

/**
 * Removes values from the object that are `null` or `undefined`.
 */
export function _filterNullishValues<T extends AnyObject>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => v !== undefined && v !== null, mutate)
}

/**
 * Removes values from the object that are `undefined`.
 * Only `undefined` values are removed. `null` values are kept!
 */
export function _filterUndefinedValues<T extends AnyObject>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => v !== undefined, mutate)
}

export function _filterEmptyArrays<T extends AnyObject>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => !Array.isArray(v) || v.length > 0, mutate)
}

/**
 * Returns clone of `obj` without properties that does not pass `predicate`.
 * Allows filtering by both key and value.
 */
export function _filterObject<T extends AnyObject>(
  obj: T,
  predicate: ObjectPredicate<T>,
  mutate = false,
): T {
  return Object.keys(obj).reduce(
    (r, k) => {
      if (!predicate(k as keyof T, r[k], obj)) delete r[k]
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
export function _mapValues<T extends AnyObject, OUT = T>(
  obj: T,
  mapper: ObjectMapper<T, any>,
  mutate = false,
): OUT {
  return Object.entries(obj).reduce((map, [k, v]) => {
    map[k] = mapper(k, v, obj)
    return map
  }, (mutate ? obj : {}) as OUT)
}

/**
 * _.mapKeys({ 'a': 1, 'b': 2 }, (key, value) => key + value)
 * // => { 'a1': 1, 'b2': 2 }
 *
 * Does not support `mutate` flag.
 */
export function _mapKeys<T extends AnyObject>(
  obj: T,
  mapper: ObjectMapper<T, string>,
): StringMap<T[keyof T]> {
  // eslint-disable-next-line unicorn/prefer-object-from-entries
  return Object.entries(obj).reduce((map, [k, v]) => {
    map[mapper(k, v, obj)] = v
    return map
  }, {})
}

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
export function _mapObject<IN extends AnyObject, OUT>(
  obj: IN,
  mapper: ObjectMapper<IN, [key: string, value: any]>,
): { [P in keyof IN]: OUT } {
  return Object.entries(obj).reduce((map, [k, v]) => {
    const r = mapper(k, v, obj) || []
    if (r[0]) {
      ;(map[r[0]] as any) = r[1]
    }
    return map
  }, {} as { [P in keyof IN]: OUT })
}

export function _findKeyByValue<T extends AnyObject>(obj: T, v: ValueOf<T>): keyof T | undefined {
  return Object.entries(obj).find(([_, value]) => value === v)?.[0] as keyof T
}

export function _objectNullValuesToUndefined<T extends AnyObject>(obj: T, mutate = false): T {
  return _mapValues(obj, (_k, v) => (v === null ? undefined : v), mutate)
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
export function _isObject(item: any): item is AnyObject {
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
 * Object is considered empty if it's one of:
 * undefined
 * null
 * '' (empty string)
 * [] (empty array)
 * {} (empty object)
 * new Map() (empty Map)
 * new Set() (empty Set)
 */
export function _isEmpty(obj: any): boolean {
  if (obj === undefined || obj === null) return true

  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0
  }

  if (obj instanceof Map || obj instanceof Set) {
    return obj.size === 0
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0
  }

  return false
}

/**
 * Returns `undefined` if it's empty (according to `_isEmpty()` specification),
 * otherwise returns the original object.
 */
export function _undefinedIfEmpty<T>(obj: T | undefined): T | undefined {
  return _isEmpty(obj) ? undefined : obj
}

/**
 * Filters the object by removing all key-value pairs where Value is Empty (according to _isEmpty() specification).
 */
export function _filterEmptyValues<T extends AnyObject>(obj: T, mutate = false): T {
  return _filterObject(obj, (_k, v) => !_isEmpty(v), mutate)
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
export function _merge<T extends AnyObject>(target: T, ...sources: any[]): T {
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
export function _deepTrim<T extends AnyObject | string>(o: T): T {
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
export function _unset<T extends AnyObject>(obj: T, prop: string): void {
  if (!_isObject(obj)) {
    return
  }
  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty(prop)) {
    delete obj[prop]
    return
  }

  const segs = prop.split('.')
  let last = segs.pop()
  while (segs.length && segs[segs.length - 1]!.slice(-1) === '\\') {
    last = segs.pop()!.slice(0, -1) + '.' + last
  }
  while (segs.length && _isObject(obj)) {
    const k = (prop = segs.shift()!)
    obj = obj[k]
  }
  if (!_isObject(obj)) return
  delete obj[last!]
}

export function _invert<T extends AnyObject>(o: T): { [k in ValueOf<T>]: keyof T | undefined } {
  const inv = {} as { [k in ValueOf<T>]: keyof T }
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
export function _get<T extends AnyObject>(obj = {} as T, path = '', def?: any): any {
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
export function _set<IN extends AnyObject, OUT = IN>(
  obj: IN,
  path: PropertyPath,
  value?: any,
): OUT {
  if (!obj || Object(obj) !== obj || !path) return obj as any // When obj is not an object

  // If not yet an array, get the keys from the string-path
  if (!Array.isArray(path)) {
    path = String(path).match(/[^.[\]]+/g) || []
  } else if (!path.length) {
    return obj as any
  }

  ;(path as any[]).slice(0, -1).reduce(
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
            // eslint-disable-next-line
            Math.abs(path[i + 1]) >> 0 === +path[i + 1]
              ? [] // Yes: assign a new array object
              : {}), // No: assign a new plain object
    obj,
  )[path[path.length - 1]!] = value // Finally assign the value to the last key

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
export function _has<T extends AnyObject>(obj: T, path?: string): boolean {
  const v = _get(obj, path)
  return v !== undefined && v !== null
}
