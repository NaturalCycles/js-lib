import { anyToErrorMessage, resultToString, SimpleMovingAverage } from '..'
import { ms } from '../util/time.util'
import { getArgsSignature, getMethodSignature } from './decorator.util'

/**
 * $r - result
 * @returns array of tokens that will be `.filter(Boolean).join(' ')`
 */
type LogResultFn = (r: any) => any[]

export interface LogMethodOpts {
  /**
   * Log "moving average" elapsed time for up to `avg` last method calls
   */
  avg?: number

  /**
   * Skip logging method arguments
   */
  noLogArgs?: boolean

  /**
   * Skip logging result length when result is an array.
   */
  noLogResultLength?: boolean

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
export function logMethod(opt: LogMethodOpts = {}): MethodDecorator {
  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new Error('@LogMillis can be applied only to methods')
    }

    const originalFn = descriptor.value
    const keyStr = String(key)

    const { avg, noLogArgs, logStart, logResult, noLogResultLength } = opt
    let { logResultFn } = opt
    if (!logResultFn) {
      if (logResult) {
        logResultFn = r => ['result:', resultToString(r)]
      } else if (!noLogResultLength) {
        logResultFn = r => (Array.isArray(r) ? [`result: ${r.length} items`] : [])
      }
    }

    const sma = avg ? new SimpleMovingAverage(avg) : undefined
    let count = 0

    descriptor.value = function(this: typeof target, ...args: any[]) {
      const started = Date.now()
      const ctx = this

      // e.g `NameOfYourClass.methodName`
      // or `NameOfYourClass(instanceId).methodName`
      const methodSignature = getMethodSignature(ctx, keyStr)
      const argsStr = getArgsSignature(args, noLogArgs)
      const callSignature = `${methodSignature}(${argsStr}) #${++count}`
      if (logStart) console.log(`>> ${callSignature}`)

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
}

function logFinished(
  callSignature: string,
  started: number,
  sma?: SimpleMovingAverage,
  logResultFn?: LogResultFn,
  res?: any,
  err?: any,
): void {
  const millis = Date.now() - started

  const t = ['<<', callSignature, 'took', ms(millis)]

  if (sma) {
    t.push(`(avg ${ms(sma.push(millis))})`)
  }

  if (typeof err !== 'undefined') {
    t.push('ERROR:', anyToErrorMessage(err))
  } else if (logResultFn) {
    t.push(...logResultFn(res))
  }

  console.log(t.filter(Boolean).join(' '))
}
