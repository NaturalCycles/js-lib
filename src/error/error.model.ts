import { StringMap } from '../types'

/**
 * Extendable payload object to transfer custom additional data with AppError.
 */
export interface ErrorData extends StringMap<any> {
  /**
   * String constant/enum that is specific for certain type of error and never changes.
   * Allows Frontend to deal with certain type of error in a specific way.
   */
  code?: string

  /**
   * User-friendly error (e.g in User's language).
   */
  userMessage?: string

  /**
   * Error id in some error tracking system (e.g Sentry).
   */
  errorId?: string
}

export interface HttpErrorData extends ErrorData {
  /**
   * @default 500
   */
  httpStatusCode: number
}

/**
 * Portable object that represents Error.
 * Has extendable generic `data` property.
 * Can be easily transformed from/to Error class via:
 * - AppError.fromErrorObject()
 * - appError.toErrorObject()
 *
 * Cannot contain any properties that stock Error doesn't have, otherwise
 * it will be hard to transform it to ErrorObject.
 * Everything "extra" should go under `data`.
 */
export interface ErrorObject<DATA_TYPE extends ErrorData = ErrorData> {
  /**
   * Name of the error / error class.
   * @default Error
   */
  name: string

  /**
   * "Technical" error message as it comes from Error.message
   */
  message?: string

  /**
   * Stacktrace of error, \n-separated, as it comes from Error.stack
   */
  stack?: string

  /**
   * Custom data to be passed with an error. Extendable.
   * It's non-optional, to save some null-checks.
   */
  data: DATA_TYPE
}

/**
 * JSON HTTP response from the Backend that represents "Error".
 */
export interface ErrorResponse<DATA_TYPE extends ErrorData = ErrorData> {
  error: ErrorObject<DATA_TYPE>
}
