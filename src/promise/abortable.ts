import { AnyFunction } from '../types'

/**
 * Similar to AbortController and AbortSignal.
 * Similar to pDefer and Promise.
 * Similar to Subject and Observable.
 *
 * Minimal interface for something that can be aborted in the future,
 * but not necessary.
 * Allows to listen to `onAbort` event.
 *
 * @experimental
 */
export class Abortable {
  constructor(public onAbort?: AnyFunction) {}

  aborted = false

  abort(): void {
    if (this.aborted) return
    this.aborted = true
    this.onAbort?.()
    this.onAbort = undefined // cleanup listener
  }

  clear(): void {
    this.onAbort = undefined
  }
}

// convenience function
export function abortable(onAbort?: AnyFunction): Abortable {
  return new Abortable(onAbort)
}
