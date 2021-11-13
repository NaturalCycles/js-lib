import { ErrorMode } from '../error/errorMode'
import { CommonLogger } from '../log/commonLogger'
import { DeferredPromise, pDefer } from './pDefer'

export interface PQueueCfg {
  concurrency: number

  /**
   * Default: THROW_IMMEDIATELY
   *
   * THROW_AGGREGATED is not supported.
   *
   * SUPPRESS_ERRORS will still log errors via logger. It will resolve the `.push` promise with void.
   */
  errorMode?: ErrorMode

  /**
   * @default true
   */
  // autoStart?: boolean

  /**
   * Default to `console`
   */
  logger?: CommonLogger

  /**
   * If true - will LOG EVERYTHING:)
   */
  debug?: boolean

  // logStatusChange?: boolean
  // logSizeChange?: boolean

  // timeout

  /**
   * By default .push method resolves when the Promise is done (finished).
   *
   * If you set resolveOn = 'start' - .push method will resolve the Promise (with void) upon
   * the START of the processing.
   *
   * @default finish
   */
  resolveOn?: 'finish' | 'start'
}

export type PromiseReturningFunction<R> = () => Promise<R>

interface PromiseReturningFunctionWithDefer<R> extends PromiseReturningFunction<R> {
  defer: DeferredPromise<R>
}

/**
 * Inspired by: https://github.com/sindresorhus/p-queue
 *
 * Allows to push "jobs" to the queue and control its concurrency.
 * Jobs are "promise-returning functions".
 *
 * API is @experimental
 */
export class PQueue {
  constructor(cfg: PQueueCfg) {
    this.cfg = {
      // concurrency: Number.MAX_SAFE_INTEGER,
      errorMode: ErrorMode.THROW_IMMEDIATELY,
      logger: console,
      debug: false,
      resolveOn: 'finish',
      ...cfg,
    }

    if (!cfg.debug) {
      this.debug = () => {}
    }
  }

  private readonly cfg: Required<PQueueCfg>

  private debug(...args: any[]): void {
    this.cfg.logger.log(...args)
  }

  inFlight = 0
  private queue: PromiseReturningFunction<any>[] = []
  private onIdleListeners: DeferredPromise[] = []

  get queueSize(): number {
    return this.queue.length
  }

  /**
   * Returns a Promise that resolves when the queue is Idle (next time, since the call).
   * Resolves immediately in case the queue is Idle.
   * Idle means 0 queue and 0 inFlight.
   */
  onIdle(): Promise<void> {
    if (this.queue.length === 0 && this.inFlight === 0) return Promise.resolve()

    const listener = pDefer()
    this.onIdleListeners.push(listener)
    return listener
  }

  /**
   * Push PromiseReturningFunction to the Queue.
   * Returns a Promise that resolves (or rejects) with the return value from the Promise.
   */
  push<R>(fn_: PromiseReturningFunction<R>): Promise<R> {
    const { concurrency } = this.cfg
    const resolveOnStart = this.cfg.resolveOn === 'start'

    const fn = fn_ as PromiseReturningFunctionWithDefer<R>
    fn.defer ||= pDefer<R>()

    if (this.inFlight < concurrency) {
      // There is room for more jobs. Can start immediately
      this.inFlight++
      this.debug(`inFlight++ ${this.inFlight}/${concurrency}, queue ${this.queue.length}`)
      if (resolveOnStart) fn.defer.resolve()

      fn()
        .then(result => {
          if (!resolveOnStart) fn.defer.resolve(result)
        })
        .catch(err => {
          this.cfg.logger.error(err)
          if (resolveOnStart) return

          if (this.cfg.errorMode === ErrorMode.SUPPRESS) {
            fn.defer.resolve() // resolve with `void`
          } else {
            // Should be handled on the outside, otherwise it'll cause UnhandledRejection
            fn.defer.reject(err)
          }
        })
        .finally(() => {
          this.inFlight--
          this.debug(`inFlight-- ${this.inFlight}/${concurrency}, queue ${this.queue.length}`)

          // check if there's room to start next job
          if (this.queue.length && this.inFlight <= concurrency) {
            const nextFn = this.queue.shift()!
            void this.push(nextFn)
          } else {
            if (this.inFlight === 0) {
              this.debug('onIdle')
              this.onIdleListeners.forEach(defer => defer.resolve())
              this.onIdleListeners.length = 0 // empty the array
            }
          }
        })
    } else {
      this.queue.push(fn)
      this.debug(`inFlight ${this.inFlight}/${concurrency}, queue++ ${this.queue.length}`)
    }

    return fn.defer
  }
}
