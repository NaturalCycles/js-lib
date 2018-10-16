import { promiseUtil } from './promise.util'

test('defer', async () => {
  let deferred = promiseUtil.defer<string>()
  let p = deferred.promise
  deferred.resolve('a')
  expect(await p).toBe('a')

  deferred = promiseUtil.defer<string>()
  p = deferred.promise
  deferred.reject(new Error())
  await expect(p).rejects.toThrow(Error)
})

test('delay', async () => {
  await promiseUtil.delay(100)
})

test('hangingPromise', async () => {
  promiseUtil.hangingPromise() // never resolves
})
