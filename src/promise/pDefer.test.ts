import { expect, test } from 'vitest'
import { pDefer } from './pDefer.js'

test('pDefer', async () => {
  let p = pDefer<string>()
  p.resolve('a')
  expect(await p).toBe('a')

  p = pDefer<string>()
  p.reject(new Error('abc'))
  await expect(p).rejects.toThrow('abc')
})
