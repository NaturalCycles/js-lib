import { _since, _stringifyAny, AnyFunction, CommonLogger } from '..'
import { TimeoutError } from './pTimeout'

export interface PRetryOptions {
  /**
   * If set - will be included in the error message.
   * Can be used to identify the place in the code that failed.
   */
  name?: string

  /**
   * Timeout for each Try, in milliseconds.
   *
   * Defaults to no timeout.
   */
  timeout?: number

  /**
   * How many attempts to try.
   * First attempt is not a retry, but "initial try". It still counts.
   * maxAttempts of 4 will be 1 try and 3 retries.
   *
   * @default 4
   */
  maxAttempts?: number

  /**
   * @default 1000 ms
   */
  delay?: number

  /**
   * @default 2
   */
  delayMultiplier?: number

  /**
   * Called on every retry (since 2nd attempt, cause 1st attempt is not a retry).
   *
   * True - keep retrying.
   * False - stop retrying and return immediately.
   *
   * @default () => true
   */
  predicate?: (err: Error, attempt: number, maxAttempts: number) => boolean

  /**
   * Log the first attempt (which is not a "retry" yet).
   *
   * @default false
   */
  logFirstAttempt?: boolean

  /**
   * Log retries - attempts that go after the first one.
   *
   * @default true
   */
  logRetries?: boolean

  /**
   * @default false
   */
  logSuccess?: boolean

  /**
   * @default true
   */
  logFailures?: boolean

  /**
   * @default false
   */
  logAll?: boolean

  /**
   * @default false
   */
  logNone?: boolean

  /**
   * Default to `console`
   */
  logger?: CommonLogger

  /**
   * Defaults to true.
   * If true - preserves the stack trace in case of a Timeout (usually - very useful!).
   * It has a certain perf cost.
   *
   * @experimental
   */
  keepStackTrace?: boolean
}

/**
 * Returns a Function (!), enhanced with retry capabilities.
 * Implements "Exponential back-off strategy" by multiplying the delay by `delayMultiplier` with each try.
 */
export function pRetryFn<T extends AnyFunction>(fn: T, opt: PRetryOptions = {}): T {
  return async function pRetryFunction(this: any, ...args: any[]) {
    return await pRetry(() => fn.call(this, ...args), opt)
  } as any
}

export async function pRetry<T>(
  fn: (attempt: number) => Promise<T>,
  opt: PRetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 4,
    delay: initialDelay = 1000,
    delayMultiplier = 2,
    predicate,
    logger = console,
    name,
    keepStackTrace = true,
    timeout,
  } = opt

  const fakeError = keepStackTrace ? new Error('RetryError') : undefined

  let { logFirstAttempt = false, logRetries = true, logFailures = false, logSuccess = false } = opt

  if (opt.logAll) {
    logSuccess = logFirstAttempt = logRetries = logFailures = true
  }
  if (opt.logNone) {
    logSuccess = logFirstAttempt = logRetries = logFailures = false
  }

  const fname = name || fn.name || 'pRetry function'

  let delay = initialDelay
  let attempt = 0
  let timer: NodeJS.Timeout | undefined
  let timedOut = false

  return await new Promise((resolve, reject) => {
    const rejectWithTimeout = () => {
      timedOut = true // to prevent more tries
      const err = new TimeoutError(`"${fname}" timed out after ${timeout} ms`)
      if (fakeError) {
        // keep original stack
        err.stack = fakeError.stack!.replace('Error: RetryError', 'TimeoutError')
      }
      reject(err)
    }

    const next = async () => {
      if (timedOut) return

      if (timeout) {
        timer = setTimeout(rejectWithTimeout, timeout)
      }

      const started = Date.now()

      try {
        attempt++
        if ((attempt === 1 && logFirstAttempt) || (attempt > 1 && logRetries)) {
          logger.log(`${fname} attempt #${attempt}...`)
        }

        const r = await fn(attempt)

        clearTimeout(timer!)

        if (logSuccess) {
          logger.log(`${fname} attempt #${attempt} succeeded in ${_since(started)}`)
        }

        resolve(r)
      } catch (err) {
        clearTimeout(timer!)

        if (logFailures) {
          logger.warn(
            `${fname} attempt #${attempt} error in ${_since(started)}:`,
            _stringifyAny(err, {
              includeErrorData: true,
            }),
          )
        }

        if (
          attempt >= maxAttempts ||
          (predicate && !predicate(err as Error, attempt, maxAttempts))
        ) {
          // Give up

          if (fakeError) {
            // Preserve the original call stack
            Object.defineProperty(err, 'stack', {
              value:
                (err as Error).stack +
                '\n    --' +
                fakeError.stack!.replace('Error: RetryError', ''),
            })
          }

          reject(err)
        } else {
          // Retry after delay
          delay *= delayMultiplier
          setTimeout(next, delay)
        }
      }
    }

    void next()
  })
}
