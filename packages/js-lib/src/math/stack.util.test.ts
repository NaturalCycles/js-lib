import { expect, test } from 'vitest'
import { _range } from '../array/range.js'
import { NumberStack, Stack } from './stack.util.js'

test('Stack', () => {
  const stack = new NumberStack(10)

  // Empty stack
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([])
  expect(stack.itemsOrdered).toEqual([])
  expect(stack.avgOrNull()).toBeNull()
  expect(stack.medianOrNull()).toBeNull()
  expect(stack.percentileOrNull(10)).toBeNull()

  // 6 items
  _range(1, 7).forEach(n => stack.push(n))
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([1, 2, 3, 4, 5, 6])
  expect(stack.itemsOrdered).toEqual([1, 2, 3, 4, 5, 6])
  expect(stack.avg()).toBe(3.5)
  expect(stack.median()).toBe(3.5)
  expect(stack.percentile(25)).toBe(2.25)

  // push 6 more items, it should overwrite itself
  _range(7, 13).forEach(n => stack.push(n))
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([11, 12, 3, 4, 5, 6, 7, 8, 9, 10])
  expect(stack.itemsOrdered).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  expect(stack.avg()).toBe(7.5)
  expect(stack.median()).toBe(7.5)
  expect(stack.percentile(25)).toBe(5.25)

  // fill with ones
  stack.fill(1)
  expect(stack.items).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
})

test('Stack fill with zeros', () => {
  const stack = new Stack(5).fill(0)
  expect(stack.items).toEqual([0, 0, 0, 0, 0])
})
