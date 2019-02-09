import { AppError } from './app.error'
import { HttpErrorData } from './error.model'

/**
 * Base class for HTTP errors - errors that define HTTP error code.
 */
export class HttpError extends AppError<HttpErrorData> {
  constructor (message?: string, data?: Partial<HttpErrorData>) {
    super(message, {
      httpStatusCode: 500,
      ...data,
    })

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
    })

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      Object.defineProperty(this, 'stack', {
        value: new Error().stack,
      })
    }
  }
}
