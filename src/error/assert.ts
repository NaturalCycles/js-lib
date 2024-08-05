import type { ErrorData, ErrorObject } from '..'
import { _deepEquals, _isErrorObject, _stringify, AssertionError, Class } from '..'

/**
 * Evaluates the `condition` (casts it to Boolean).
 * Expects it to be truthy, otherwise throws AppError.
 *
 * Should be used NOT for "expected" / user-facing errors, but
 * vice-versa - for completely unexpected and 100% buggy "should never happen" cases.
 *
 * It'll result in http 500 on the server (cause that's the right code for "unexpected" errors).
 * Pass { backendResponseStatusCode: x } at errorData argument to override the http code (will be picked up by backend-lib).
 *
 * API is similar to Node's assert(), except:
 * 1. Throws js-lib's AppError
 * 2. Has a default message, if not provided
 *
 * Since 2024-07-10 it no longer sets `userFriendly: true` by default.
 */
export function _assert(
  condition: any, // will be evaluated as Boolean
  message?: string,
  errorData?: ErrorData,
): asserts condition {
  if (!condition) {
    throw new AssertionError(message || 'condition failed', {
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
  errorData?: ErrorData,
): asserts actual is T {
  if (actual !== expected) {
    const msg =
      message ||
      ['not equal', `expected: ${_stringify(expected)}`, `got     : ${_stringify(actual)}`]
        .filter(Boolean)
        .join('\n')

    throw new AssertionError(msg, {
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
  errorData?: ErrorData,
): asserts actual is T {
  if (!_deepEquals(actual, expected)) {
    const msg =
      message ||
      ['not deeply equal', `expected: ${_stringify(expected)}`, `got     : ${_stringify(actual)}`]
        .filter(Boolean)
        .join('\n')

    throw new AssertionError(msg, {
      ...errorData,
    })
  }
}

export function _assertIsError<ERR extends Error = Error>(
  err: any,
  errorClass: Class<ERR> = Error as any,
): asserts err is ERR {
  if (!(err instanceof errorClass)) {
    throw new AssertionError(
      `Expected to be instanceof ${errorClass.name}, actual typeof: ${typeof err}`,
    )
  }
}

/**
 * Asserts that passed object is indeed an Error of defined ErrorClass.
 * If yes - returns peacefully (with TypeScript assertion).
 * In not - throws (re-throws) that error up.
 */
export function _assertErrorClassOrRethrow<ERR extends Error>(
  err: any,
  errorClass: Class<ERR>,
): asserts err is ERR {
  if (!(err instanceof errorClass)) {
    // re-throw
    throw err
  }
}

export function _assertIsErrorObject<DATA_TYPE extends ErrorData = ErrorData>(
  obj: any,
): asserts obj is ErrorObject<DATA_TYPE> {
  if (!_isErrorObject(obj)) {
    throw new AssertionError(`Expected to be ErrorObject, actual typeof: ${typeof obj}`)
  }
}

export function _assertIsString(v: any, message?: string): asserts v is string {
  _assertTypeOf<string>(v, 'string', message)
}

export function _assertIsNumber(v: any, message?: string): asserts v is number {
  _assertTypeOf<number>(v, 'number', message)
}

export function _assertTypeOf<T>(v: any, expectedType: string, message?: string): asserts v is T {
  // biome-ignore lint/suspicious/useValidTypeof: ok
  if (typeof v !== expectedType) {
    const msg = message || `Expected typeof ${expectedType}, actual typeof: ${typeof v}`
    throw new AssertionError(msg)
  }
}
