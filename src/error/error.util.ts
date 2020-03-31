import {
  AppError,
  ErrorData,
  ErrorObject,
  HttpError,
  HttpErrorData,
  HttpErrorResponse,
  jsonParseIfPossible,
} from '..'

const EMPTY_STRING_MSG = 'empty_string'

export function anyToAppError<DATA_TYPE = ErrorData>(
  o: any,
  data: Partial<DATA_TYPE> = {},
): AppError {
  const e = anyToErrorObject(o)
  Object.assign(e.data, data)

  return errorObjectToAppError(e)
}

/**
 * Converts "anything" to ErrorObject.
 * Detects if it's HttpErrorResponse, HttpErrorObject, ErrorObject, Error, etc..
 * If object is Error - Error.message will be used.
 * Objects get converted to prettified JSON string.
 */
export function anyToErrorObject(o: any): ErrorObject {
  if (o instanceof Error) return errorToErrorObject(o)

  o = jsonParseIfPossible(o)

  if (isHttpErrorResponse(o)) {
    return (o as HttpErrorResponse).error
  }

  if (isErrorObject(o)) return o

  let message: string

  if (o instanceof Error) {
    message = o.message || EMPTY_STRING_MSG
  } else if (typeof o === 'object' && o !== null) {
    // Careful here, circular dependency may occur, especially in Node.js/Express realm
    message = JSON.stringify(o, null, 2) || EMPTY_STRING_MSG
  } else {
    message = String(o) || EMPTY_STRING_MSG
  }

  return {
    message,
    data: {}, // empty
  }
}

/**
 * Converts "anything" to String error message.
 * Uses anyToErrorObject() and takes `message` and `data` from it.
 * Pass includeData=true to include JSON-pretty-stringified `data` object (if not empty)
 */
export function anyToErrorMessage(o: any, includeData = false): string {
  const eo = anyToErrorObject(o)

  return [
    eo.message,
    includeData && Object.keys(eo.data).length > 0 && JSON.stringify(eo.data, null, 2),
  ]
    .filter(Boolean)
    .join('\n')
}

export function errorToErrorObject(e: Error): ErrorObject {
  if (e instanceof AppError) return appErrorToErrorObject(e)

  return {
    // name: e.name,
    message: e.message,
    stack: e.stack,
    data: { ...(e as any).data }, // empty by default
  }
}

export function errorObjectToAppError<T>(o: ErrorObject<T>): AppError<T> {
  const err = Object.assign(new AppError(o.message, o.data), {
    // name: err.name, // cannot be assigned to a readonly property like this
    // stack: o.stack, // also readonly e.g in Firefox
  })

  Object.defineProperty(err, 'stack', {
    value: o.stack,
  })

  return err
}

export function errorObjectToHttpError(o: ErrorObject): HttpError {
  const err = Object.assign(
    new HttpError(o.message, {
      httpStatusCode: 500, // default
      ...o.data,
    }),
    {
      // name: err.name, // cannot be assigned to a readonly property like this
      // stack: o.stack, // readonly
    },
  )

  Object.defineProperty(err, 'stack', {
    value: o.stack,
  })

  return err
}

export function appErrorToErrorObject<T>(err: AppError<T>): ErrorObject<T> {
  return {
    // name: err.name,
    message: err.message,
    stack: err.stack,
    data: err.data,
  }
}

export function appErrorToHttpError(err: AppError<HttpErrorData>): HttpError {
  return new HttpError(err.message, err.data)
}

export function isHttpErrorResponse(o: any): boolean {
  return isHttpErrorObject(o?.error)
}

export function isHttpErrorObject(o: any): boolean {
  return typeof o?.message === 'string' && typeof o?.data?.httpStatusCode === 'number'
}

export function isErrorObject(o: any): boolean {
  return typeof o?.message === 'string' && typeof o?.data === 'object'
}
