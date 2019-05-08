import { isObject } from './object.util'

export function capitalizeFirstLetter (s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function lowercaseFirstLetter (s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
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
