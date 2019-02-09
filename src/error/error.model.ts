import { StringMap } from '../types'

/**
 * Extendable payload object to transfer custom additional data with AppError.
 */
export interface ErrorData extends StringMap<any> {
  /**
   * If present, will be displayed to the User as is.
   */
  userMessage?: string
}

export interface HttpErrorData extends ErrorData {
  /**
   * @default 500
   */
  httpStatusCode?: number
}

/**
 * JSON HTTP response from the Backend that represents "Error".
 */
export interface ErrorResponse {
  /**
   * "Technical" error message as it comes from Error.message
   */
  err: string

  errData: HttpErrorData

  /**
   * String constant/enum that is specific for certain type of error and never changes.
   * Allows Frontend to deal with certain type of error in a specific way.
   */
  errType?: string

  /**
   * Stacktrace of error, \n-separated, as it comes from Error.stack
   */
  errStack?: string

  errId?: string
}
