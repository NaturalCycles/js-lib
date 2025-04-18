import { expect, test } from 'vitest'
import { pDefer } from './pDefer.js'
import { pDelay } from './pDelay.js'
import { pState } from './pState.js'

test('pending', async () => {
  const p = new Promise(() => {}) // hanging promise
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  expect(await pState(p)).toBe('pending')
})

test('resolved', async () => {
  const p = pDefer<string>()
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  p.resolve('hello')
  expect(await pState(p)).toBe('resolved')
  expect(await p).toBe('hello')
})

test('rejected', async () => {
  const p = pDefer<string>()
  expect(await pState(p)).toBe('pending')
  await pDelay(100)
  p.reject(new Error('bad'))
  expect(await pState(p)).toBe('rejected')
  await expect(p).rejects.toThrowError('bad')
})
