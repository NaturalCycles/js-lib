import type { PromisableFunction } from '../types'
import { DeferredPromise, pDefer } from './pDefer'

/**
 * Promisified version of setTimeout.
 *
 * Can return a value.
 * If value is instanceof Error - rejects the Promise instead of resolving.
 */
export async function pDelay<T>(ms = 0, value?: T): Promise<T> {
  return await new Promise<T>((resolve, reject) =>
    setTimeout(value instanceof Error ? reject : resolve, ms, value),
  )
}

/* eslint-disable @typescript-eslint/promise-function-async */

/**
 * Promisified version of setTimeout.
 *
 * Wraps the passed function with try/catch,
 * catch will propagate to pDelayFn rejection,
 * otherwise pDelayFn will resolve with returned value.
 *
 * On abort() - clears the Timeout and immediately resolves the Promise with void.
 */
export function pDelayFn<T>(ms = 0, fn: PromisableFunction<T>): DeferredPromise<T> {
  const p = pDefer<T>()

  const timer = setTimeout(async () => {
    try {
      p.resolve(await fn())
    } catch (err) {
      p.reject(err as Error)
    }
  }, ms)

  p.abort = () => {
    clearTimeout(timer)
    // p.rejectAborted(reason) // nope
    p.resolve()
  }

  return p
}
