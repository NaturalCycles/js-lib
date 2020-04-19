/**
 * Attempts to parse object as JSON.
 * Returns original object if JSON parse failed (silently).
 */
import { AppError, ErrorObject, _isErrorObject } from '..'

export function _jsonParseIfPossible(obj: any): any {
  if (typeof obj === 'string' && obj) {
    try {
      return JSON.parse(obj)
    } catch {}
  }

  return obj
}

export interface StringifyAnyOptions {
  /**
   * @default 1000
   * Default limit is less than in Node, cause it's likely to be used e.g in Browser alert()
   */
  maxLen?: number

  /**
   * @default false
   * Set to true to not print Error.stack (keeping just Error.message).
   */
  noErrorStack?: boolean
}

/**
 * Inspired by inspectAny from nodejs-lib, which is based on util.inpect that is not available in Browser.
 * Potentially can do this (with extra 2Kb gz size): https://github.com/deecewan/browser-util-inspect
 *
 * Transforms ANY to human-readable string (via JSON.stringify pretty).
 * Safe (no error throwing).
 *
 * Correclty prints Errors, AppErrors, ErrorObjects: error.message + \n + stringifyAny(error.data)
 *
 * Enforces max length (default to 1000, pass 0 to skip it).
 *
 * Logs numbers as-is, e.g: `6`.
 * Logs strings as-is (without single quotes around, unlike default util.inspect behavior).
 * Otherwise - just uses JSON.stringify().
 *
 * Returns 'empty_string' if empty string is passed.
 * Returns 'undefined' if undefined is passed (default util.inspect behavior).
 *
 * TODO: This function implementation/purpose very much overlaps with `anyToErrorMessage`. Clarify it somehow.
 */
export function _stringifyAny(obj: any, opt: StringifyAnyOptions = {}): string {
  let s: string

  obj = _jsonParseIfPossible(obj) // in case it's e.g non-pretty JSON, or even a stringified ErrorObject

  if (obj instanceof Error) {
    // Stack includes message
    s = (!opt.noErrorStack && obj.stack) || [obj?.name, obj.message].filter(Boolean).join(': ')

    if (obj instanceof AppError || _isErrorObject(obj)) {
      const data = ((obj as any) as ErrorObject).data
      s = [s, Object.keys(data).length > 0 && _stringifyAny(data, opt)].filter(Boolean).join('\n')
    }
  } else if (_isErrorObject(obj)) {
    s = [obj.message, Object.keys(obj.data).length > 0 && _stringifyAny(obj.data, opt)]
      .filter(Boolean)
      .join('\n')
  } else if (typeof obj === 'string') {
    s = obj.trim() || 'empty_string'
  } else {
    try {
      s = JSON.stringify(obj, null, 2)
    } catch (_) {
      s = String(obj) // fallback
    }
  }

  // Handle maxLen
  if (opt.maxLen && s.length > opt.maxLen) {
    s = s.substr(0, opt.maxLen) + `... ${Math.ceil(s.length / 1024)} KB message truncated`
  }

  return s
}
