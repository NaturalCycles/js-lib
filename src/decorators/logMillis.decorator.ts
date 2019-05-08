import { anyToErrorMessage, SimpleMovingAverage } from '..'
export interface LogMillisOpts {
  /**
   * Log "moving average" elapsed time for up to `avg` last method calls
   */
  avg?: number

  /**
   * Skip logging method arguments
   */
  noLogArgs?: boolean
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

  const { avg, noLogArgs } = opt
  const sma = avg ? new SimpleMovingAverage(avg) : undefined
  let count = 0

  descriptor.value = function (this: any, ...args: any[]) {
    const argsStr = noLogArgs ? '' : args.join(' ')

    const callSignature = `${methodSignature}(${argsStr}) #${++count}`
    console.log(`>> ${callSignature}`)

    const ctx = this
    const started = Date.now()

    try {
      const res = originalFn.apply(ctx, args)

      if (res && typeof res.then === 'function') {
        // Result is a promise, will wait for resolution or rejection
        return res
          .then((r: any) => {
            logFinished(callSignature, started, sma)
            return r
          })
          .catch((err: any) => {
            logFinished(callSignature, started, sma, err)
            return Promise.reject(err)
          })
      } else {
        // not a Promise
        logFinished(callSignature, started, sma)
        return res
      }
    } catch (err) {
      logFinished(callSignature, started, sma, err)
      throw err // rethrow
    }
  } as any

  return descriptor
}

function logFinished (
  callSignature: string,
  started: number,
  sma?: SimpleMovingAverage,
  err?: any,
): void {
  const ms = Date.now() - started

  const t = ['<<', callSignature, 'took', msToStr(ms)]

  if (sma) {
    t.push(`(avg ${msToStr(sma.push(ms))})`)
  }

  if (typeof err !== 'undefined') {
    t.push('ERROR:', anyToErrorMessage(err))
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
