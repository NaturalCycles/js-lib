import { AppError } from './app.error'
import { HttpErrorData } from './error.model'

/**
 * Base class for HTTP errors - errors that define HTTP error code.
 */
export class HttpError<DATA_TYPE extends HttpErrorData = HttpErrorData> extends AppError<
  DATA_TYPE
> {
  constructor (message: string, data: DATA_TYPE) {
    super(message, data)

    this.constructor = HttpError
    ;(this as any).__proto__ = HttpError.prototype
    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true, // otherwise throws with "TypeError: Cannot redefine property: name"
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
