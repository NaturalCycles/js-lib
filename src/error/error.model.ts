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
