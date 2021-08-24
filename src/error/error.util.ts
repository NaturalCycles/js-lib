import {
  AppError,
  ErrorData,
  ErrorObject,
  HttpErrorData,
  HttpErrorResponse,
  StringifyAnyOptions,
  _jsonParseIfPossible,
  _stringifyAny,
} from '..'

/**
 * Converts "anything" to ErrorObject.
 * Detects if it's HttpErrorResponse, HttpErrorObject, ErrorObject, Error, etc..
 * If object is Error - Error.message will be used.
 * Objects (not Errors) get converted to prettified JSON string (via `_stringifyAny`).
 */
export function _anyToErrorObject(o: any, opt?: StringifyAnyOptions): ErrorObject {
  if (o instanceof Error) {
    return _errorToErrorObject(o, opt?.includeErrorStack)
  }

  o = _jsonParseIfPossible(o)

  if (_isHttpErrorResponse(o)) {
    return o.error
  }

  if (_isErrorObject(o)) return o

  // Here we are sure it has no `data` property,
  // so, fair to return `data: {}` in the end
  // Also we're sure it includes no "error name", e.g no `Error: ...`,
  // so, fair to include `name: 'Error'`

  const message = _stringifyAny(o, opt)

  return {
    name: 'Error',
    message,
    data: {}, // empty
  }
}

export function _errorToErrorObject<DATA_TYPE extends ErrorData = ErrorData>(
  e: AppError<DATA_TYPE> | Error,
  includeErrorStack = false,
): ErrorObject<DATA_TYPE> {
  const obj: ErrorObject<DATA_TYPE> = {
    name: e.name,
    message: e.message,
    data: { ...(e as any).data }, // empty by default
  }

  if (includeErrorStack) {
    obj.stack = e.stack
  }

  return obj
}

export function _errorObjectToAppError<DATA_TYPE>(o: ErrorObject<DATA_TYPE>): AppError<DATA_TYPE> {
  const err = Object.assign(new AppError(o.message, o.data), {
    // name: err.name, // cannot be assigned to a readonly property like this
    // stack: o.stack, // also readonly e.g in Firefox
  })

  Object.defineProperty(err, 'name', {
    value: o.name,
    configurable: true,
  })

  Object.defineProperty(err, 'stack', {
    value: o.stack,
  })

  return err
}

export function _isHttpErrorResponse(o: any): o is HttpErrorResponse {
  return _isHttpErrorObject(o?.error)
}

export function _isHttpErrorObject(o: any): o is ErrorObject<HttpErrorData> {
  return (
    typeof o?.name === 'string' &&
    typeof o?.message === 'string' &&
    typeof o?.data?.httpStatusCode === 'number'
  )
}

export function _isErrorObject(o: any): o is ErrorObject {
  return (
    typeof o?.name === 'string' && typeof o?.message === 'string' && typeof o?.data === 'object'
  )
}
