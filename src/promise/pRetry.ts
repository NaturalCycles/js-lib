import { anyToErrorMessage } from '..'
import { since } from '../util/time.util'

export interface PRetryOptions {
  maxAttempts: number

  /**
   * @default 500 ms
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
  predicate?: (err: any, attempt: number, maxAttempts: number) => boolean

  /**
   * @default false
   */
  logFirstAttempt?: boolean

  /**
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
}

export function pRetry<T extends Function> (fn: T, opt: PRetryOptions): T {
  const { maxAttempts, delay: initialDelay, delayMultiplier, predicate } = {
    delay: 500,
    delayMultiplier: 2,
    ...opt,
  }
  let { logFirstAttempt, logRetries, logFailures, logSuccess } = {
    logRetries: true,
    logFailures: true,
    ...opt,
  }
  if (opt.logAll) {
    logFirstAttempt = logRetries = logFailures = true
  }
  if (opt.logNone) {
    logSuccess = logFirstAttempt = logRetries = logFailures = false
  }

  const fname = fn.name || 'anonymous'

  return async function (this: any, ...args: any[]) {
    let delay = initialDelay
    let attempt = 0

    return new Promise((resolve, reject) => {
      const next = async () => {
        const started = Date.now()

        try {
          attempt++
          if ((attempt === 1 && logFirstAttempt) || logRetries) {
            console.log(`pRetry.${fname} attempt #${attempt}...`)
          }

          // tslint:disable-next-line:no-invalid-this
          const r = await fn.apply(this, args)

          if (logSuccess) {
            console.log(`pRetry.${fname} attempt #${attempt} succeeded in ${since(started)}`)
          }
          resolve(r)
        } catch (err) {
          if (logFailures) {
            console.warn(
              `pRetry.${fname} attempt #${attempt} error in ${since(started)}: ${anyToErrorMessage(
                err,
              )}`,
            )
          }

          if (attempt > maxAttempts || (predicate && !predicate(err, attempt, maxAttempts))) {
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
