import { expect, test } from 'vitest'
import { isClientSide, isServerSide } from './env'

test('isServerSide', () => {
  expect(isServerSide()).toBe(true)
  expect(isClientSide()).toBe(false)
})
