/**
 * Similar to Deferred object, which is also a promise itself (instead of deferred.promise).
 */
export interface DeferredPromise<T = void> extends Promise<T> {
  resolve(a?: T): void
  reject(e?: Error): void
}

/**
 * Returns DeferredPromise - a Promise that has .resolve() and .reject() methods.
 */
export function pDefer<T = void>(): DeferredPromise<T> {
  let resolve: any
  let reject: any

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as DeferredPromise<T>

  promise.resolve = resolve
  promise.reject = reject

  return promise
}
