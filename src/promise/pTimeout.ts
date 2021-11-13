import { AnyFunction } from '../types'

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
export function pTimeout<T extends AnyFunction>(fn: T, opt: PTimeoutOptions): T {
  // const fname = fn.name || 'function'
  const { timeout, name, onTimeout } = opt

  return async function (this: any, ...args: any[]) {
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

        reject(
          new Error(`"${name || fn.name || 'pTimeout function'}" timed out after ${timeout} ms`),
        )
      }, timeout)

      // Execute the Function
      try {
        resolve(await fn.apply(this, args))
      } catch (err) {
        reject(err)
      } finally {
        clearTimeout(timer)
      }
    })
  } as any
}
