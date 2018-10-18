export interface Deferred<T> {
  promise: Promise<T>
  resolve (a?: T): void
  reject (e?: any): void
}

class PromiseSharedUtil {
  defer<T = void> (): Deferred<T> {
    const deferred = {} as Deferred<T>

    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })

    return deferred
  }

  async delay (ms: number): Promise<void> {
    return new Promise<void>(r => setTimeout(r, ms))
  }

  async hangingPromise (): Promise<void> {
    return new Promise<void>(r => {})
  }
}

export const promiseSharedUtil = new PromiseSharedUtil()
