import { _isErrorObject, _isHttpErrorObject, _isHttpErrorResponse } from '../error/error.util'
import { Reviver } from '../types'
import { _jsonParseIfPossible } from './json.util'
import { _safeJsonStringify } from './safeJsonStringify'

export type JsonStringifyFunction = (obj: any, reviver?: Reviver, space?: number) => string

export interface StringifyAnyOptions {
  /**
   * @default 10_000
   * Default limit is less than in Node, cause it's likely to be used e.g in Browser alert()
   */
  maxLen?: number

  /**
   * Pass true to include "stringified" `error.data` in the output.
   *
   * @default false
   */
  includeErrorData?: boolean

  /**
   * Set to true to print Error.stack instead of just Error.message.
   *
   * @default false
   */
  includeErrorStack?: boolean

  /**
   * Allows to pass custom "stringify function".
   * E.g in Node.js you can pass `util.inspect` instead.
   *
   * @default JSON.stringify
   */
  stringifyFn?: JsonStringifyFunction
}

/**
 * Inspired by inspectAny from nodejs-lib, which is based on util.inpect that is not available in the Browser.
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
 */
export function _stringifyAny(obj: any, opt: StringifyAnyOptions = {}): string {
  if (obj === undefined) return 'undefined'
  if (obj === null) return 'null'
  if (typeof obj === 'function') return 'function'
  if (typeof obj === 'symbol') return obj.toString()

  let s: string

  // Parse JSON string, if possible
  obj = _jsonParseIfPossible(obj) // in case it's e.g non-pretty JSON, or even a stringified ErrorObject

  //
  // HttpErrorResponse
  //
  if (_isHttpErrorResponse(obj)) {
    return _stringifyAny(obj.error, opt)
  }

  if (obj instanceof Error || _isErrorObject(obj)) {
    //
    // Error or ErrorObject
    //

    if (opt.includeErrorStack && obj.stack) {
      // Stack includes message
      s = obj.stack
    } else {
      // Omit "default" error name as non-informative
      // UPD: no, it's still important to understand that we're dealing with Error and not just some string
      // if (obj?.name === 'Error') {
      //   s = obj.message
      // }
      s = [obj.name, obj.message].join(': ')
    }

    if (_isErrorObject(obj)) {
      if (_isHttpErrorObject(obj)) {
        // `replace` here works ONCE, exactly as we need it
        s = s.replace('HttpError', `HttpError(${obj.data.httpStatusCode})`)
      }

      // Here we ensure it has `data`
      const { data } = obj
      if (opt.includeErrorData && Object.keys(data).length > 0) {
        s = [s, _stringifyAny(data, opt)].join('\n')
      }
    } else if (typeof (obj as any).code === 'string') {
      // Error that has no `data`, but has `code` property
      s = [s, `code: ${(obj as any).code}`].join('\n')
    }
  } else if (typeof obj === 'string') {
    //
    // String
    //

    s = obj.trim() || 'empty_string'
  } else {
    //
    // Other
    //
    try {
      const { stringifyFn = _safeJsonStringify } = opt

      s = stringifyFn(obj, undefined, 2)
    } catch {
      s = String(obj) // fallback
    }
  }

  // Shouldn't happen, but some weird input parameters may return this
  if (s === undefined) return 'undefined'

  // Handle maxLen
  const { maxLen = 10_000 } = opt
  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen) + `... ${Math.ceil(s.length / 1024)} KB message truncated`
  }

  return s
}
