// Heavily inspired by https://github.com/epoberezkin/fast-deep-equal

/**
 Returns true if a and b are deeply equal.
 
 Equality is checked recursively, with the following rules/caveats:
 - Primitive values are checked with ===
 - NaN === NaN
 - Array length should be the same, and every value should be equal
 - Sets are checked similarly to arrays (but order doesn't matter in Sets)
 - Objects and Maps are checked that all values match. Undefined values are treated the same as absent key (important!)
 - Order of object/Map keys doesn't matter, unlike when comparing JSON.stringify(a) === JSON.stringify(b)
 - Regex are compared by their source and flags
 - Functions are compared by their `.toString`
 - Any object that overrides `.toString()` is compared by that (e.g Function)
 - Any object that overrides `.valueOf()` is compared by that (e.g Date)
 
 What are the differences between various deep-equality functions?
 There are:
 - _deepEquals
 - _deepJsonEquals
 - _jsonEquals
 
 _deepEquals uses "common sense" equality.
 It tries to work "as you would expect it to".
 With the important caveat that undefined values are treated the same as absent key.
 So, _deepEquals should be the first choice.
 It's also the most performant of 3.
 
 _deepJsonEquals uses different logic, that's often not what you expect.
 It should be used to compare objects of how they would look after "passing via JSON.stringify",
 for example when you return it over the API to the Frontend,
 or when you pass it to be saved to the Database.
 If some object has custom .toJSON() implementation - it'll invoke that (similar to JSON.stringify).
 For these cases - it can be better than _deepEquals.
 And it's better than _jsonEquals, because it doesn't fail/depend on object key order.
 
 _jsonEquals is simply JSON.stringify(a) === JSON.stringify(b).
 It's the simplest implementation, but also the slowest of 3.
 
 TLDR: _deepEquals should be useful in most of the cases, start there.
 */
export function _deepEquals(a: any, b: any): boolean {
  if (a === b) return true

  if (Number.isNaN(a)) {
    return Number.isNaN(b)
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (a.constructor !== b.constructor) return false

    if (Array.isArray(a)) {
      const length = a.length
      if (length !== b.length) return false
      for (let i = length; i-- !== 0; ) {
        if (!_deepEquals(a[i], b[i])) return false
      }
      return true
    }

    if (a instanceof Map && b instanceof Map) {
      for (const key of new Set([...a.keys(), ...b.keys()])) {
        if (!_deepEquals(a.get(key), b.get(key))) return false
      }
      return true
    }

    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false
      for (const key of a) {
        if (!b.has(key)) return false
      }
      return true
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf()
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString()

    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!_deepEquals(a[key], b[key])) return false
    }

    return true
  }

  return a === b
}

/**
 Returns true if a and b are deeply equal.
 
 Equality is checked in the same way as if both arguments are processed via
 JSON.stringify and JSON.parse:
 - undefined values are removed, undefined values in an array are turned into `null`, etc.
 - Any Regex, Map, Set, Function stringifies to {}.
 - Date stringifies to its IsoDateTimeString representation.
 - Any object that implements toJSON is compared by the output of its toJSON().
 - NaN stringifies to null
 - Order of object keys does not matter, unlike when comparing JSON.stringify(a) === JSON.stringify(b)
 
 See _deepEquals docs for more details and comparison.
 */
export function _deepJsonEquals(a: any, b: any): boolean {
  if (a === b) return true

  if (Number.isNaN(a)) {
    a = null
  } else if (typeof a === 'function') {
    a = undefined
  } else if (a && typeof a === 'object') {
    if (a instanceof Date) {
      a = a.valueOf()
    } else if ('toJSON' in a) {
      a = a.toJSON()
    }
  }
  if (Number.isNaN(b)) {
    b = null
  } else if (typeof b === 'function') {
    b = undefined
  } else if (b && typeof b === 'object') {
    if (b instanceof Date) {
      b = b.valueOf()
    } else if ('toJSON' in b) {
      b = b.toJSON()
    }
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a)) {
      const length = a.length
      if (length !== b.length) return false
      for (let i = length; i-- !== 0; ) {
        if (!_deepJsonEquals(a[i], b[i])) return false
      }
      return true
    }

    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!_deepJsonEquals(a[key], b[key])) return false
    }

    return true
  }

  return a === b
}

/**
 * Shortcut for JSON.stringify(a) === JSON.stringify(b)
 *
 * Simplest "deep equals" implementation, but also the slowest,
 * and not robust, in the sense that it depends on the order of object keys.
 */
export function _jsonEquals(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
