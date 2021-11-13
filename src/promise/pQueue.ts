import { CommonLogger } from '../log/commonLogger'
import { DeferredPromise, pDefer } from './pDefer'

export interface PQueueCfg {
  concurrency: number

  /**
   * Default: THROW_IMMEDIATELY
   */
  // errorMode?: ErrorMode

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
}

export type PromiseReturningFunction = () => Promise<any>

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
      logger: console,
      debug: false,
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
  private queue: PromiseReturningFunction[] = []
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
    if (this.queue.length === 0) return Promise.resolve()

    const listener = pDefer()
    this.onIdleListeners.push(listener)
    return listener
  }

  push(fn: PromiseReturningFunction): void {
    const { concurrency } = this.cfg

    if (this.inFlight < concurrency) {
      // There is room for more jobs. Can start immediately
      this.inFlight++
      this.debug(`inFlight++ ${this.inFlight}/${concurrency}, queue ${this.queue.length}`)

      fn()
        .catch(err => {
          this.cfg.logger.error(err)
        })
        .finally(() => {
          this.inFlight--
          this.debug(`inFlight-- ${this.inFlight}/${concurrency}, queue ${this.queue.length}`)

          // check if there's room to start next job
          if (this.queue.length && this.inFlight <= concurrency) {
            const nextFn = this.queue.shift()!
            this.push(nextFn)
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
  }
}
