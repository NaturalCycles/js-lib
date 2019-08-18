export interface Deferred<T = void> {
  promise: Promise<T>
  resolve (a?: T): void
  reject (e?: any): void
}

/**
 * Returns Deferred object.
 */
export function pDefer<T = void> (): Deferred<T> {
  const deferred = {} as Deferred<T>

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })

  return deferred
}
