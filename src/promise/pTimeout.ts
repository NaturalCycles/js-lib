import { AppError } from '../error/app.error'
import { AnyFunction } from '../types'

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
  const { timeout, name, onTimeout } = opt

  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve, reject) => {
    // Prepare the timeout timer
    const timer = setTimeout(() => {
      if (onTimeout) {
        try {
          resolve(onTimeout())
        } catch (err) {
          reject(err)
        }
        return
      }

      reject(new TimeoutError(`"${name || 'pTimeout function'}" timed out after ${timeout} ms`))
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
