import { _since, _stringifyAny } from '../index'

export interface TryCatchOptions {
  /**
   * The value returned from the function will be returned from the wrapped method (!).
   * onError function may be asynchronous.
   */
  onError?: (err: unknown) => any

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
 *
 * @experimental
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
        console.log(`tryCatch.${fname} succeeded in ${_since(started)}`)
      }

      return r
    } catch (err) {
      if (logError) {
        console.warn(
          `tryCatch.${fname} error in ${_since(started)}:\n${_stringifyAny(err, {
            includeErrorData: true,
          })}`,
        )
      }

      if (onError) {
        try {
          return await onError(err) // eslint-disable-line @typescript-eslint/return-await
        } catch {}
      }
      // returns undefined, but doesn't rethrow
    }
  } as any
}

export const _TryCatch =
  (opt: TryCatchOptions = {}): MethodDecorator =>
  (target, key, descriptor) => {
    const originalFn = descriptor.value
    descriptor.value = _tryCatch(originalFn as any, opt)
    return descriptor
  }
