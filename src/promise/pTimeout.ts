import { AppError } from '../error/app.error'
import { AnyFunction, AnyObject } from '../types'

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
   */
  onTimeout?: () => any

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
  errorData?: AnyObject
}

/**
 * Decorates a Function with a timeout.
 * Throws an Error if the Function is not resolved in a certain time.
 * If the Function rejects - passes this rejection further.
 */
export function pTimeoutFn<T extends AnyFunction>(fn: T, opt: PTimeoutOptions): T {
  opt.name ||= fn.name

  return async function pTimeoutInternalFn(this: any, ...args: any[]) {
    return await pTimeout(fn.apply(this, args), opt)
  } as any
}

/**
 * Decorates a Function with a timeout and immediately calls it.
 * Throws an Error if the Function is not resolved in a certain time.
 * If the Function rejects - passes this rejection further.
 */
export async function pTimeout<T>(promise: Promise<T>, opt: PTimeoutOptions): Promise<T> {
  // todo: check how we can automatically infer function name (only applicable to named functions)
  const { timeout, name, onTimeout, keepStackTrace = true } = opt
  const fakeError = keepStackTrace ? new Error('TimeoutError') : undefined

  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    // Prepare the timeout timer
    const timer = setTimeout(() => {
      if (onTimeout) {
        try {
          resolve(onTimeout())
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

      const err = new TimeoutError(
        `"${name || 'pTimeout function'}" timed out after ${timeout} ms`,
        opt.errorData,
      )
      if (fakeError) err.stack = fakeError.stack // keep original stack
      reject(err)
    }, timeout)

    // Execute the Function
    try {
      resolve(await promise)
    } catch (err) {
      reject(err)
    } finally {
      clearTimeout(timer)
    }
  })
}
