import { arrayRange, dedupeArray, flatArray } from './array.util'

test('flatArray', () => {
  const a = [[1, 2], [3], [4, 5]]
  expect(flatArray(a)).toEqual([1, 2, 3, 4, 5])
})

test('dedupeArray', () => {
  const a = [1, 2, 2, 1, 3, 5, 3, 4]
  expect(dedupeArray(a)).toEqual([1, 2, 3, 5, 4])
})

test('arrayRange', () => {
  expect(arrayRange(3, 6)).toEqual([3, 4, 5])
})
