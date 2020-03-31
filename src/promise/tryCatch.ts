import { anyToErrorMessage } from '..'
import { since } from '../util/time.util'

export interface TryCatchOptions {
  onError?: (err: Error) => any

  /**
   * @default false
   */
  logSuccess?: boolean

  /**
   * @default true
   */
  logError?: boolean
}

/**
 * Decorates a function with "try/catch", so it'll never reject/throw.
 * Only applies to async functions (or, turns sync function into async).
 *
 * Allows to pass onError callback.
 */
export function _tryCatch<T extends Function>(fn: T, opt: TryCatchOptions = {}): T {
  const { onError, logError, logSuccess } = {
    logError: true,
    ...opt,
  }

  const fname = fn.name || 'anonymous'

  return async function (this: any, ...args: any[]) {
    const started = Date.now()

    try {
      const r = await fn.apply(this, args)

      if (logSuccess) {
        console.log(`tryCatch.${fname} succeeded in ${since(started)}`)
      }

      return r
    } catch (err) {
      if (logError) {
        console.warn(
          `tryCatch.${fname} error in ${since(started)}: ${anyToErrorMessage(err, true)}`,
        )
      }

      if (onError) {
        try {
          onError(err)
        } catch (_ignored) {}
      }
      // returns undefined, but doesn't rethrow
    }
  } as any
}

export const TryCatch = (opt: TryCatchOptions = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  const originalFn = descriptor.value
  descriptor.value = _tryCatch(originalFn as any, opt)
  return descriptor
}
