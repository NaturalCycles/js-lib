import { AppError } from '../error/app.error'
import type { ErrorData } from '../error/error.model'
import type { AnyAsyncFunction } from '../types'

export class TimeoutError extends AppError {}

export interface PTimeoutOptions {
  /**
   * Timeout in milliseconds.
   */
  timeout: number

  /**
   * If set - will be included in the error message.
   * Can be used to identify the place in the code that failed.
   */
  name?: string

  /**
   * If provided - will be called INSTEAD of throwing an error.
   * Can be used to thrown a custom error OR resolve a promise without throwing.
   *
   * err (which is TimeoutError) is passed as an argument for convenience, so it can
   * be logged or such. You don't have to consume it in any way though.
   */
  onTimeout?(err: TimeoutError): any

  /**
   * Defaults to true.
   * If true - preserves the stack trace in case of a Timeout (usually - very useful!).
   * It has a certain perf cost.
   *
   * @experimental
   */
  keepStackTrace?: boolean

  /**
   * Will be merged with `err.data` object.
   */
  errorData?: ErrorData
}

/**
 * Decorates a Function with a timeout.
 * Returns a decorated Function.
 *
 * Throws an Error if the Function is not resolved in a certain time.
 * If the Function rejects - passes this rejection further.
 */
export function pTimeoutFn<T extends AnyAsyncFunction>(fn: T, opt: PTimeoutOptions): T {
  opt.name ||= fn.name

  return async function pTimeoutInternalFn(this: any, ...args: any[]) {
    return await pTimeout(() => fn.apply(this, args), opt)
  } as T
}

/**
 * Decorates a Function with a timeout and immediately calls it.
 *
 * Throws an Error if the Function is not resolved in a certain time.
 * If the Function rejects - passes this rejection further.
 */
export async function pTimeout<T>(fn: AnyAsyncFunction<T>, opt: PTimeoutOptions): Promise<T> {
  const { timeout, name = fn.name || 'pTimeout function', onTimeout, keepStackTrace = true } = opt
  const fakeError = keepStackTrace ? new Error('TimeoutError') : undefined

  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    // Prepare the timeout timer
    const timer = setTimeout(() => {
      const err = new TimeoutError(`"${name}" timed out after ${timeout} ms`, opt.errorData)
      if (fakeError) err.stack = fakeError.stack // keep original stack

      if (onTimeout) {
        try {
          resolve(onTimeout(err))
        } catch (err: any) {
          if (fakeError) err.stack = fakeError.stack // keep original stack
          err.data = {
            ...err.data,
            ...opt.errorData,
          }
          reject(err)
        }
        return
      }

      reject(err)
    }, timeout)

    // Execute the Function
    try {
      resolve(await fn())
    } catch (err) {
      reject(err)
    } finally {
      clearTimeout(timer)
    }
  })
}
