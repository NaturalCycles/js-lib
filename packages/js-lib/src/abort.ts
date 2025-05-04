/**
 * Like AbortSignal, but it can "abort itself" via the `.abort()` method.
 *
 * Similar to how DeferredPromise is both a Promise and has `.resolve()` and `.reject()` methods.
 *
 * This is to simplify the AbortController/AbortSignal usage.
 *
 * Before this - you need to keep track of 2 things: AbortController and AbortSignal.
 *
 * After - you are good with only AbortableSignal, which can do both.
 * And it's compatible with AbortSignal (because it extends it).
 *
 * @experimental
 */
export interface AbortableSignal extends AbortSignal {
  abort: AbortController['abort']
}

/**
 * Creates AbortableSignal,
 * which is like AbortSignal, but can "abort itself" with `.abort()` method.
 *
 * @experimental
 */
export function createAbortableSignal(): AbortableSignal {
  const ac = new AbortController()
  return Object.assign(ac.signal, {
    abort: ac.abort.bind(ac),
  })
}
