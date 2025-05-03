import { expect, test } from 'vitest'

test('time should work as normal', () => {
  const d = new Date()
  console.log(d)
  expect(d.getFullYear()).toBeGreaterThan(2018)
})
