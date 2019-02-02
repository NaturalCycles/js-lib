import { ErrorData } from './error.model'
import { Error403 } from './error403'

/**
 * HTTP 403: Admin access forbidden
 */
export class Error403Admin extends Error403 {
  constructor (message?: string, data?: ErrorData) {
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
