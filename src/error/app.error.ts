import { ErrorData } from './error.model'

/**
 * Base class for all our (not system) errors.
 *
 * message - "technical" message. Frontend decides to show it or not.
 * data - optional "any" payload.
 * data.userMessage - if present, will be displayed to the User as is.
 */
export class AppError<DATA_TYPE extends ErrorData = ErrorData> extends Error {
  constructor (message?: string, public data = {} as DATA_TYPE) {
    super(message)

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
