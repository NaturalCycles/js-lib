import { isObject } from './object.util'

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 */
export function _capitalize (s: string = ''): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export function _upperFirst (s: string = ''): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function _lowerFirst (s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

/**
 * Like String.split(), but with limit, returning the tail together with last element.
 *
 * @return Returns the new array of string segments.
 */
export function _split (str: string, separator: string, limit: number): any {
  const parts = str.split(separator)
  const tail = parts.slice(limit - 1).join(separator)
  const result = parts.slice(0, limit - 1)
  result.push(tail)
  return result
}

export function removeWhitespace (s: string): string {
  return s.replace(/\s/g, '')
}

const EMPTY_STRING_MSG = 'empty_string'

/**
 * Transforms any "result" to String.
 * For logging/printing/human purposes.
 * For example, '' will be shown as 'empty_string'
 * `undefined` will be shown as 'undefined'
 * Objects will be JSON-pretty-printed, etc.
 */
export function resultToString (r: any): string {
  let msg: string

  if (r instanceof Error) {
    msg = r.message
  } else if (isObject(r)) {
    msg = JSON.stringify(r, null, 2)
  } else {
    msg = String(r)
  }

  return msg || EMPTY_STRING_MSG
}
