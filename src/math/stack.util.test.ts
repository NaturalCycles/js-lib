import { _range } from '../array/range'
import { SizeLimitedStack } from './stack.util'

test('SizeLimitedStack', () => {
  const stack = new SizeLimitedStack(10)

  // Empty stack
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([])
  expect(stack.itemsOrdered).toEqual([])

  // 6 items
  _range(1, 7).forEach(n => stack.push(n))
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([1, 2, 3, 4, 5, 6])
  expect(stack.itemsOrdered).toEqual([1, 2, 3, 4, 5, 6])

  // push 6 more items, it should overwrite itself
  _range(7, 13).forEach(n => stack.push(n))
  expect(stack.size).toBe(10)
  expect(stack.items).toEqual([11, 12, 3, 4, 5, 6, 7, 8, 9, 10])
  expect(stack.itemsOrdered).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
})
