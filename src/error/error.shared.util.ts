import { AppError, HttpError, HttpErrorData, objectUtil } from '..'
import { ErrorObject } from '../error/error.model'

const EMPTY_STRING_MSG = 'empty_string'

class ErrorSharedUtil {
  /**
   * Converts "anything" to String error message.
   * Objects get converted to prettified JSON string.
   */
  anyToErrorMessage (o: any): string {
    if (objectUtil.isObject(o)) {
      return JSON.stringify(o, null, 2)
    }

    return String(o) || EMPTY_STRING_MSG
  }

  anyToErrorObject (o: any): ErrorObject {
    if (o instanceof Error) return this.errorToErrorObject(o)

    return {
      name: 'Error',
      message: this.anyToErrorMessage(o),
      data: { ...(o || {}).data }, // empty by default
    }
  }

  errorToErrorObject (e: Error): ErrorObject {
    if (e instanceof AppError) return this.appErrorToErrorObject(e)

    return {
      name: e.name,
      message: e.message,
      stack: e.stack,
      data: { ...(e as any).data }, // empty by default
    }
  }

  errorObjectToAppError<T> (o: ErrorObject<T>): AppError<T> {
    const err = Object.assign(new AppError(o.message, o.data), {
      // name: err.name, // cannot be assigned to a readonly property like this
      stack: o.stack,
    })

    Object.defineProperty(err, 'name', {
      value: o.name,
    })

    return err
  }

  errorObjectToHttpError (o: ErrorObject): HttpError {
    const err = Object.assign(new HttpError(o.message, o.data), {
      // name: err.name, // cannot be assigned to a readonly property like this
      stack: o.stack,
    })

    Object.defineProperty(err, 'name', {
      value: o.name,
    })

    return err
  }

  appErrorToErrorObject<T> (err: AppError<T>): ErrorObject<T> {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      data: err.data,
    }
  }

  appErrorToHttpError (err: AppError<HttpErrorData>): HttpError {
    return new HttpError(err.message, err.data)
  }
}

export const errorSharedUtil = new ErrorSharedUtil()
