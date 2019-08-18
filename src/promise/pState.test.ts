import { pDefer } from './pDefer'
import { pDelay } from './pDelay'
import { pState } from './pState'

test('pending', async () => {
  const p = new Promise(() => {}) // hanging promise
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  expect(await pState(p)).toBe('pending')
})

test('resolved', async () => {
  const defer = pDefer<string>()
  const p = defer.promise
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  defer.resolve('hello')
  expect(await pState(p)).toBe('resolved')
  expect(await p).toBe('hello')
})

test('rejected', async () => {
  const defer = pDefer<string>()
  const p = defer.promise
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  defer.reject(new Error('bad'))
  expect(await pState(p)).toBe('rejected')
  await expect(p).rejects.toThrowError('bad')
})
