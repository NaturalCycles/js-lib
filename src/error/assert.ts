import { HttpErrorData, _deepEquals, _stringifyAny } from '..'
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
  errorData?: HttpErrorData,
): asserts condition {
  if (!condition) {
    throw new AppError(message || '_assert error (see stacktrace)', {
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
  errorData?: HttpErrorData,
): asserts actual is T {
  if (actual !== expected) {
    let msg = `_assertEquals got (${actual}), but expected (${expected})`
    if (message) msg += `, ${message}`
    throw new AppError(msg, {
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
  errorData?: HttpErrorData,
): asserts actual is T {
  if (!_deepEquals(actual, expected)) {
    const msg = [
      `_assertDeepEquals`,
      `got     : ${_stringifyAny(actual)}`,
      `expected: ${_stringifyAny(expected)}`,
      message,
    ]
      .filter(Boolean)
      .join('\n')

    throw new AppError(msg, {
      userFriendly: true,
      ...errorData,
    })
  }
}
