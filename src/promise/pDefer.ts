export interface Deferred<T = void> {
  promise: Promise<T>
  resolve(a: T): void
  reject(e?: Error): void
}

/**
 * Returns Deferred object.
 */
export function pDefer<T = void>(): Deferred<T> {
  const deferred = {} as Deferred<T>

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}

/**
 * Similar to Deferred object, which is also a promise itself (instead of deferred.promise).
 */
export interface DeferredPromise<T = void> extends Promise<T> {
  resolve(a: T): void
  reject(e?: Error): void
}

/**
 * Returns DeferredPromise.
 */
export function pDeferredPromise<T = void>(): DeferredPromise<T> {
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
