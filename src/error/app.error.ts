import type { ErrorData, ErrorObject } from './error.model'

/**
 * Base class for all our (not system) errors.
 *
 * message - "technical" message. Frontend decides to show it or not.
 * data - optional "any" payload.
 * data.userFriendly - if present, will be displayed to the User as is.
 *
 * Based on: https://medium.com/@xpl/javascript-deriving-from-error-properly-8d2f8f315801
 */
export class AppError<DATA_TYPE extends ErrorData = ErrorData> extends Error {
  data!: DATA_TYPE

  /**
   * `cause` here is normalized to be an ErrorObject
   */
  override cause?: ErrorObject

  constructor(message: string, data = {} as DATA_TYPE, opt: AppErrorOptions = {}) {
    super(message)
    const { name = this.constructor.name, cause } = opt

    Object.defineProperties(this, {
      name: {
        value: name,
        configurable: true,
        writable: true,
      },
      data: {
        value: data,
        writable: true,
        configurable: true,
        enumerable: false,
      },
    })

    if (cause) {
      Object.defineProperty(this, 'cause', {
        // I'd love to do _anyToError(opt.cause) here, but it causes circular dep ;(
        value: cause,
        writable: true,
        configurable: true,
        enumerable: true, // unlike standard - setting it to true for "visibility"
      })
    }

    // this is to allow changing this.constuctor.name to a non-minified version
    Object.defineProperty(this.constructor, 'name', {
      value: name,
      configurable: true,
      writable: true,
    })

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

/**
 * Extra options for AppError constructor.
 */
export interface AppErrorOptions {
  /**
   * Overrides Error.name and Error.constructor.name
   */
  name?: string

  /**
   * Sets Error.cause
   */
  cause?: ErrorObject
}
