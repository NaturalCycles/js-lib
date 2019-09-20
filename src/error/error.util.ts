import { AppError, ErrorData, ErrorObject, HttpError, HttpErrorData, isObject } from '..'

const EMPTY_STRING_MSG = 'empty_string'

/**
 * Converts "anything" to String error message.
 * If object is Error - Error.message will be used.
 * Objects get converted to prettified JSON string.
 */
export function anyToErrorMessage(o: any): string {
  let msg: string

  if (o instanceof Error) {
    msg = o.message
  } else if (isObject(o)) {
    msg = JSON.stringify(o, null, 2)
  } else {
    msg = String(o)
  }

  return msg || EMPTY_STRING_MSG
}

export function anyToErrorObject(o: any): ErrorObject {
  if (o instanceof Error) return errorToErrorObject(o)

  return {
    // name: 'Error',
    message: anyToErrorMessage(o),
    data: { ...(o || {}).data }, // empty by default
  }
}

export function anyToAppError<DATA_TYPE = ErrorData>(
  o: any,
  data: Partial<DATA_TYPE> = {},
): AppError {
  const e = anyToErrorObject(o)
  Object.assign(e.data, data)

  return errorObjectToAppError(e)
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
