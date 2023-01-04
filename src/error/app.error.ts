import type { ErrorData } from './error.model'

/**
 * Base class for all our (not system) errors.
 *
 * message - "technical" message. Frontend decides to show it or not.
 * data - optional "any" payload.
 * data.userMessage - if present, will be displayed to the User as is.
 *
 * Based on: https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
 */
export class AppError<DATA_TYPE extends ErrorData = ErrorData> extends Error {
  data!: DATA_TYPE

  /**
   * cause here is normalized to be instance of Error
   */
  override cause?: Error

  constructor(message: string, data = {} as DATA_TYPE, opt?: ErrorOptions, name?: string) {
    super(message)

    Object.defineProperty(this, 'name', {
      value: name || this.constructor.name,
      configurable: true,
      writable: true,
    })

    // this is to allow changing this.constuctor.name to a non-minified version
    Object.defineProperty(this.constructor, 'name', {
      value: name || this.constructor.name,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(this, 'data', {
      value: data,
      writable: true,
      configurable: true,
      enumerable: false,
    })

    if (opt?.cause) {
      Object.defineProperty(this, 'cause', {
        // I'd love to do _anyToError(opt.cause) here, but it causes circular dep ;(
        value: opt.cause,
        writable: true,
        configurable: true,
        enumerable: false,
      })
    }

    // todo: check if it's needed at all!
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor)
    // } else {
    //   Object.defineProperty(this, 'stack', {
    //     value: new Error().stack, // eslint-disable-line unicorn/error-message
    //     writable: true,
    //     configurable: true,
    //   })
    // }
  }
}
