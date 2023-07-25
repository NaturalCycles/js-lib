import { AppError } from './app.error'
import type { ErrorObject, HttpRequestErrorData } from './error.model'

/**
 * Error that is thrown when Http Request was made and returned an error.
 * Thrown by, for example, Fetcher.
 *
 * On the Frontend this Error class represents the error when calling the API,
 * contains all the necessary request and response information.
 *
 * On the Backend, similarly, it represents the error when calling some 3rd-party API
 * (backend-to-backend call).
 * On the Backend it often propagates all the way to the Backend error handler,
 * where it would be wrapped in BackendErrorResponseObject.
 *
 * Please note that `ErrorData.backendResponseStatusCode` is NOT exactly the same as
 * `HttpRequestErrorData.responseStatusCode`.
 * E.g 3rd-party call may return 401, but our Backend will still wrap it into an 500 error
 * (by default).
 */
export class HttpRequestError extends AppError<HttpRequestErrorData> {
  constructor(message: string, data: HttpRequestErrorData, cause: ErrorObject) {
    super(message, data, cause, 'HttpRequestError')
  }

  /**
   * Cause is strictly-defined for HttpRequestError,
   * so it always has a cause.
   * (for dev convenience)
   */
  override cause!: ErrorObject
}
