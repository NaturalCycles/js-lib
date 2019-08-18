import { pDefer } from './pDefer'

test('defer', async () => {
  let deferred = pDefer<string>()
  let p = deferred.promise
  deferred.resolve('a')
  expect(await p).toBe('a')

  deferred = pDefer<string>()
  p = deferred.promise
  deferred.reject(new Error('abc'))
  await expect(p).rejects.toThrow('abc')
})
