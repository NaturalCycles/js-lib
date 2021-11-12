/**
 * Extendable payload object to transfer custom additional data with AppError.
 */
export interface ErrorData {
  /**
   * String constant/enum that is specific for certain type of error and never changes.
   * Allows Frontend to deal with certain type of error in a specific way.
   */
  code?: string

  /**
   * If error.message is user-friendly (can be shown to the user "as is")
   */
  userFriendly?: boolean

  /**
   * Error id in some error tracking system (e.g Sentry).
   */
  errorId?: string

  /**
   * Set to true to force reporting this error (e.g to Sentry).
   * Useful to be able to force-report e.g a 4xx error, which by default wouldn't be reported.
   */
  report?: boolean

  /**
   * Sometimes error.message gets "decorated" with extra information
   * (e.g frontend-lib adds a method, url, etc for all the errors)
   * `originalMessage` is used to preserve the original `error.message` as it came from the backend.
   */
  originalMessage?: string

  /**
   * Open-ended.
   */
  [k: string]: any
}

export interface HttpErrorData extends ErrorData {
  /**
   * @default 500
   */
  httpStatusCode: number

  /**
   * @example
   *
   * GET /api/some-endpoint
   */
  // endpoint?: string

  /**
   * Set to true when the error was thrown after response headers were sent.
   */
  headersSent?: boolean
}

export interface Admin401ErrorData extends HttpErrorData {
  adminAuthRequired: true
}

export interface Admin403ErrorData extends HttpErrorData {
  /**
   * Returns non-empty array.
   */
  adminPermissionsRequired: string[]
}

/**
 * Portable object that represents Error.
 * Has extendable generic `data` property.
 * Can be easily transformed from/to Error class via:
 * - errorObjectToAppError()
 * - appErrorToErrorObject()
 *
 * Cannot contain any properties that stock Error doesn't have, otherwise
 * it will be hard to transform it to ErrorObject.
 * Everything "extra" should go under `data`.
 */
export interface ErrorObject<DATA_TYPE extends ErrorData = ErrorData> {
  /**
   * Name of the error / error class.
   *
   * @example `Error`
   */
  // Name is removed right now, cause we should not rely on "name"
  // due to "subclassing reasons" (you lose name when you subclass)
  // It's allowed to rely on error.code and error.data.* instead
  // UPD: not anymore. Subclassing issues are fully fixed now (for es2015+ code)
  name: string

  /**
   * Error.message
   */
  message: string

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
export interface HttpErrorResponse<DATA_TYPE extends HttpErrorData = HttpErrorData> {
  error: ErrorObject<DATA_TYPE>
}
