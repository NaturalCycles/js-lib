/**
 * Base class for all our (not system) errors
 */
export class AppError extends Error {
  constructor (message?: string, public data?: any) {
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
