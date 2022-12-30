import type { ErrorData, ErrorObject, HttpErrorData, HttpErrorResponse, Class } from '..'
import { AppError, _jsonParseIfPossible, _stringifyAny } from '..'

/**
 * Useful to ensure that error in `catch (err) { ... }`
 * is indeed an Error (and not e.g `string` or `undefined`).
 * 99% of the cases it will be Error already.
 * Becomes more useful since TypeScript 4.4 made `err` of type `unknown` by default.
 *
 * Alternatively, if you're sure it's Error - you can use `_assertIsError(err)`.
 */
export function _anyToError<ERROR_TYPE extends Error = Error>(
  o: any,
  errorClass: Class<ERROR_TYPE> = Error as any,
  errorData?: ErrorData,
): ERROR_TYPE {
  let e: ERROR_TYPE

  if (o instanceof errorClass) {
    e = o
  } else {
    // If it's an instance of Error, but ErrorClass is something else (e.g AppError) - it'll be "repacked" into AppError

    const errorObject = _anyToErrorObject(o)
    e = _errorObjectToError(errorObject, errorClass)
  }

  if (errorData) {
    ;(e as any).data = {
      ...(e as any).data,
      ...errorData,
    }
  }

  return e
}

/**
 * Converts "anything" to ErrorObject.
 * Detects if it's HttpErrorResponse, HttpErrorObject, ErrorObject, Error, etc..
 * If object is Error - Error.message will be used.
 * Objects (not Errors) get converted to prettified JSON string (via `_stringifyAny`).
 */
export function _anyToErrorObject<DATA_TYPE extends ErrorData = ErrorData>(
  o: any,
  errorData?: Partial<DATA_TYPE>,
): ErrorObject<DATA_TYPE> {
  let eo: ErrorObject<DATA_TYPE>

  if (o instanceof Error) {
    eo = _errorToErrorObject<DATA_TYPE>(o)
  } else {
    o = _jsonParseIfPossible(o)

    if (_isHttpErrorResponse(o)) {
      eo = o.error as any
    } else if (_isErrorObject(o)) {
      eo = o as ErrorObject<DATA_TYPE>
    } else {
      // Here we are sure it has no `data` property,
      // so, fair to return `data: {}` in the end
      // Also we're sure it includes no "error name", e.g no `Error: ...`,
      // so, fair to include `name: 'Error'`
      const message = _stringifyAny(o)

      eo = {
        name: 'Error',
        message,
        data: {} as DATA_TYPE, // empty
      }
    }
  }

  Object.assign(eo.data, errorData)
  return eo
}

export function _errorToErrorObject<DATA_TYPE extends ErrorData = ErrorData>(
  e: AppError<DATA_TYPE> | Error,
): ErrorObject<DATA_TYPE> {
  const obj: ErrorObject<DATA_TYPE> = {
    name: e.name,
    message: e.message,
    data: { ...(e as any).data }, // empty by default
    stack: e.stack,
  }

  if (e.cause) {
    obj.cause = _anyToErrorObject(e.cause)
  }

  return obj
}

export function _errorObjectToAppError<DATA_TYPE extends ErrorData>(
  o: ErrorObject<DATA_TYPE>,
): AppError<DATA_TYPE> {
  return _errorObjectToError(o, AppError)
}

export function _errorObjectToError<DATA_TYPE extends ErrorData, ERROR_TYPE extends Error>(
  o: ErrorObject<DATA_TYPE>,
  errorClass: Class<ERROR_TYPE> = Error as any,
): ERROR_TYPE {
  if (o instanceof errorClass) return o

  const err = new errorClass(o.message)
  // name: err.name, // cannot be assigned to a readonly property like this
  // stack: o.stack, // also readonly e.g in Firefox

  Object.defineProperty(err, 'name', {
    value: o.name,
    configurable: true,
  })

  Object.defineProperty(err, 'data', {
    value: o.data,
    writable: true,
    configurable: true,
    enumerable: false,
  })

  if (o.stack) {
    Object.defineProperty(err, 'stack', {
      value: o.stack,
    })
  }

  if (o.cause) {
    Object.defineProperty(err, 'cause', {
      value: o.cause,
      writable: true,
      configurable: true,
      enumerable: false,
    })
  }

  return err
}

export function _isHttpErrorResponse(o: any): o is HttpErrorResponse {
  return _isHttpErrorObject(o?.error)
}

export function _isHttpErrorObject(o: any): o is ErrorObject<HttpErrorData> {
  return (
    !!o &&
    typeof o.name === 'string' &&
    typeof o.message === 'string' &&
    typeof o.data?.httpStatusCode === 'number'
  )
}

/**
 * Note: any instance of AppError is also automatically an ErrorObject
 */
export function _isErrorObject(o: any): o is ErrorObject {
  return (
    !!o &&
    typeof o === 'object' &&
    typeof o.name === 'string' &&
    typeof o.message === 'string' &&
    typeof o.data === 'object'
  )
}

// export function _isErrorLike(o: any): o is ErrorLike {
//   return !!o && typeof o === 'object' && typeof o.name === 'string' && typeof o.message === 'string'
// }

/**
 * Convenience function to safely add properties to Error's `data` object
 * (even if it wasn't previously existing)
 *
 * @example
 *
 * try {} catch (err) {
 *   _errorDataAppend(err, {
 *     httpStatusCode: 401,
 *   })
 * }
 */
export function _errorDataAppend(err: any, data: ErrorData): void {
  err.data = {
    ...err.data,
    ...data,
  }
}
