import { anyToErrorMessage, resultToString, SimpleMovingAverage } from '..'

type LogResultFn = (r: any) => string

export interface LogMillisOpts {
  /**
   * Log "moving average" elapsed time for up to `avg` last method calls
   */
  avg?: number

  /**
   * Skip logging method arguments
   */
  noLogArgs?: boolean

  /**
   * Also log on method start.
   * Example:
   *
   * >> syncMethodSuccess()
   */
  logStart?: boolean

  /**
   * Log method result as is (stringified).
   * Example:
   *
   * * << syncMethodSuccess() took 124 ms result: 'SomeString as result'
   */
  logResult?: boolean

  /**
   * Log method result via provided function that takes "result as is" as first argument and should return a String.
   * Overrides `logResult`.
   */
  logResultFn?: LogResultFn
}

/**
 * Console-logs when method had started, when it finished, time taken and if error happened.
 * Supports both sync and async methods.
 * Awaits if method returns a Promise.
 *
 * @example output:
 *
 * >> syncMethodSuccess()
 * << syncMethodSuccess() took 124 ms
 *
 * >> asyncMethod()
 * << asyncMethodThrow() took 10 ms ERROR: MyError
 */
export const logMillis = (opt: LogMillisOpts = {}): MethodDecorator => (
  target,
  key,
  descriptor,
) => {
  if (typeof descriptor.value !== 'function') {
    throw new Error('@LogMillis can be applied only to methods')
  }

  const originalFn = descriptor.value

  // e.g `NameOfYourClass.methodName`
  const methodSignature = [target.constructor.name, key].filter(Boolean).join('.')

  const { avg, noLogArgs, logStart, logResult } = opt
  let { logResultFn } = opt
  if (logResult) logResultFn = r => resultToString(r)

  const sma = avg ? new SimpleMovingAverage(avg) : undefined
  let count = 0

  descriptor.value = function (this: any, ...args: any[]) {
    const argsStr = noLogArgs ? '' : args.join(' ')

    const callSignature = `${methodSignature}(${argsStr}) #${++count}`
    if (logStart) console.log(`>> ${callSignature}`)

    const ctx = this
    const started = Date.now()

    try {
      const res = originalFn.apply(ctx, args)

      if (res && typeof res.then === 'function') {
        // Result is a Promise, will wait for resolution or rejection
        return res
          .then((r: any) => {
            logFinished(callSignature, started, sma, logResultFn, r)
            return r
          })
          .catch((err: any) => {
            logFinished(callSignature, started, sma, logResultFn, undefined, err)
            return Promise.reject(err)
          })
      } else {
        // not a Promise
        logFinished(callSignature, started, sma, logResultFn, res)
        return res
      }
    } catch (err) {
      logFinished(callSignature, started, sma, logResultFn, undefined, err)
      throw err // rethrow
    }
  } as any

  return descriptor
}

function logFinished (
  callSignature: string,
  started: number,
  sma?: SimpleMovingAverage,
  logResultFn?: LogResultFn,
  res?: any,
  err?: any,
): void {
  const ms = Date.now() - started

  const t = ['<<', callSignature, 'took', msToStr(ms)]

  if (sma) {
    t.push(`(avg ${msToStr(sma.push(ms))})`)
  }

  if (typeof err !== 'undefined') {
    t.push('ERROR:', anyToErrorMessage(err))
  } else if (logResultFn) {
    t.push('result:', logResultFn(res))
  }

  console.log(t.filter(Boolean).join(' '))
}

function msToStr (ms: number): string {
  if (ms >= 10000) {
    return `${Math.round(ms / 1000)} sec`
  }

  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(3)} sec`
  }

  return `${Math.round(ms)} ms`
}
