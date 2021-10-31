import { ErrorData, HttpErrorData, _deepEquals, _stringifyAny } from '..'
import { AppError } from './app.error'

/**
 * Evaluates the `condition` (casts it to Boolean).
 * Expects it to be truthy, otherwise throws AppError.
 *
 * Should be used NOT for "expected" / user-facing errors, but
 * vice-versa - for completely unexpected and 100% buggy "should never happen" cases.
 *
 * It'll result in http 500 on the server (cause that's the right code for "unexpected" errors).
 * Pass { httpStatusCode: x } at errorData argument to override the http code (will be picked up by backend-lib).
 *
 * API is similar to Node's assert(), except:
 * 1. Throws js-lib's AppError
 * 2. Has a default message, if not provided
 * 3. Sets `userFriendly` flag to true, cause it's always better to have at least SOME clue, rather than fully generic "Oops" error.
 */
export function _assert(
  condition: any, // will be evaluated as Boolean
  message?: string,
  errorData?: Partial<HttpErrorData>,
): asserts condition {
  if (!condition) {
    throw new AssertionError(message || 'see stacktrace', {
      userFriendly: true,
      ...errorData,
    })
  }
}

/**
 * Like _assert(), but prints more helpful error message.
 * API is similar to Node's assert.equals().
 *
 * Does SHALLOW, but strict equality (===), use _assertDeepEquals() for deep equality.
 */
export function _assertEquals<T>(
  actual: any,
  expected: T,
  message?: string,
  errorData?: Partial<HttpErrorData>,
): asserts actual is T {
  if (actual !== expected) {
    const msg = [
      message || 'not equal',
      `expected: ${_stringifyAny(expected)}`,
      `got     : ${_stringifyAny(actual)}`,
    ]
      .filter(Boolean)
      .join('\n')

    throw new AssertionError(msg, {
      userFriendly: true,
      ...errorData,
    })
  }
}

/**
 * Like _assert(), but prints more helpful error message.
 * API is similar to Node's assert.deepEquals().
 *
 * Does DEEP equality via _deepEquals()
 */
export function _assertDeepEquals<T>(
  actual: any,
  expected: T,
  message?: string,
  errorData?: Partial<HttpErrorData>,
): asserts actual is T {
  if (!_deepEquals(actual, expected)) {
    const msg = [
      message || `not deeply equal`,
      `expected: ${_stringifyAny(expected)}`,
      `got     : ${_stringifyAny(actual)}`,
    ]
      .filter(Boolean)
      .join('\n')

    throw new AssertionError(msg, {
      userFriendly: true,
      ...errorData,
    })
  }
}

export function _assertIsError<ERR extends Error = Error>(
  err: any,
  message?: string,
): asserts err is ERR {
  if (!(err instanceof Error)) {
    const msg = [message || `expected to be instanceof Error`, `actual typeof: ${typeof err}`].join(
      '\n',
    )

    throw new AssertionError(msg, {
      userFriendly: true,
    })
  }
}

export function _assertIsString(v: any, message?: string): asserts v is string {
  _assertTypeOf<string>(v, 'string', message)
}

export function _assertIsNumber(v: any, message?: string): asserts v is number {
  _assertTypeOf<number>(v, 'number', message)
}

export function _assertTypeOf<T>(v: any, expectedType: string, message?: string): asserts v is T {
  if (typeof v !== expectedType) {
    const msg = [
      message || `unexpected type`,
      `expected: ${expectedType}`,
      `got     : ${typeof v}`,
    ].join('\n')

    throw new AssertionError(msg, {
      userFriendly: true,
    })
  }
}

export class AssertionError extends AppError {
  constructor(message: string, data = {} as ErrorData) {
    super(message, data)
  }
}
