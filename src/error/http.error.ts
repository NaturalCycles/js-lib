import { AppError } from './app.error'
import { HttpErrorData } from './error.model'

function DEF_DATA (): HttpErrorData {
  return {
    httpStatusCode: 500,
  }
}

/**
 * Base class for HTTP errors - errors that define HTTP error code.
 */
export class HttpError extends AppError {
  constructor (message?: string, public data: HttpErrorData = DEF_DATA()) {
    super(message, data)

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
