import { AppError } from '../error/app.error'
import { promiseSharedUtil } from './promise.shared.util'

test('defer', async () => {
  let deferred = promiseSharedUtil.defer<string>()
  let p = deferred.promise
  deferred.resolve('a')
  expect(await p).toBe('a')

  deferred = promiseSharedUtil.defer<string>()
  p = deferred.promise
  deferred.reject(new AppError())
  await expect(p).rejects.toThrow(AppError)
})

test('delay', async () => {
  await promiseSharedUtil.delay(100)
})

test('hangingPromise', async () => {
  promiseSharedUtil.hangingPromise() // never resolves
})
