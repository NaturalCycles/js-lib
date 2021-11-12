import { _since, _stringifyAny, CommonLogger } from '..'

export interface PRetryOptions {
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
  predicate?: (err: unknown, attempt: number, maxAttempts: number) => boolean

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
}

/**
 * Returns a Function (!), enhanced with retry capabilities.
 * Implements "Exponential back-off strategy" by multiplying the delay by `delayMultiplier` with each try.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function pRetry<T extends Function>(fn: T, opt: PRetryOptions = {}): T {
  const {
    maxAttempts = 4,
    delay: initialDelay = 1000,
    delayMultiplier = 2,
    predicate,
    logger = console,
  } = opt

  let { logFirstAttempt = false, logRetries = true, logFailures = false, logSuccess = false } = opt

  if (opt.logAll) {
    logFirstAttempt = logRetries = logFailures = true
  }
  if (opt.logNone) {
    logSuccess = logFirstAttempt = logRetries = logFailures = false
  }

  const fname = ['pRetry', fn.name].filter(Boolean).join('.')

  return async function (this: any, ...args: any[]) {
    let delay = initialDelay
    let attempt = 0

    return await new Promise((resolve, reject) => {
      const next = async () => {
        const started = Date.now()

        try {
          attempt++
          if ((attempt === 1 && logFirstAttempt) || (attempt > 1 && logRetries)) {
            logger.log(`${fname} attempt #${attempt}...`)
          }

          const r = await fn.apply(this, args)

          if (logSuccess) {
            logger.log(`${fname} attempt #${attempt} succeeded in ${_since(started)}`)
          }
          resolve(r)
        } catch (err) {
          if (logFailures) {
            logger.warn(
              `${fname} attempt #${attempt} error in ${_since(started)}:\n${_stringifyAny(err, {
                includeErrorData: true,
              })}`,
            )
          }

          if (attempt >= maxAttempts || (predicate && !predicate(err, attempt, maxAttempts))) {
            // Give up
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
  } as any
}
