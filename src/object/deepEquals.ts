const isArray = Array.isArray
const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty

/**
 * deepEquals, but after JSON stringify/parse
 * E.g if object A has extra properties with value `undefined` -
 * it won't be _deepEquals true, but will be _deepJsonEquals true.
 * (because JSON.stringify removes undefined properties).
 */
export function _deepJsonEquals(a: any, b: any): boolean {
  if (a === b) return true
  const aj = JSON.stringify(a)
  const bj = JSON.stringify(b)
  if (aj === bj) return true
  return _deepEquals(JSON.parse(aj), JSON.parse(bj))
}

/**
 * Based on: https://github.com/epoberezkin/fast-deep-equal/
 */
export function _deepEquals(a: any, b: any): boolean {
  if (a === b) return true

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const arrA = isArray(a)
    const arrB = isArray(b)
    let i: number
    let length: number
    let key: string

    if (arrA !== arrB) return false

    if (arrA && arrB) {
      length = a.length
      if (length !== b.length) return false
      for (i = length; i-- !== 0; ) if (!_deepEquals(a[i], b[i])) return false
      return true
    }

    const dateA = a instanceof Date
    const dateB = b instanceof Date
    if (dateA !== dateB) return false
    if (dateA && dateB) return a.getTime() === b.getTime()

    const regexpA = a instanceof RegExp
    const regexpB = b instanceof RegExp
    if (regexpA !== regexpB) return false
    if (regexpA && regexpB) return a.toString() === b.toString()

    const keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) return false

    for (i = length; i-- !== 0; ) if (!hasProp.call(b, keys[i]!)) return false

    for (i = length; i-- !== 0; ) {
      key = keys[i]!
      if (!_deepEquals(a[key], b[key])) return false
    }

    return true
  }

  // eslint-disable-next-line no-self-compare
  return a !== a && b !== b
}
