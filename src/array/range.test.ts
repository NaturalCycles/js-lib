import { _range, _times } from './range'

test('_range', () => {
  expect(_range(3)).toEqual([0, 1, 2])
  expect(_range(3, 6)).toEqual([3, 4, 5])
  expect(_range(6, 3)).toEqual([])
  expect(_range(1, 10, 2)).toEqual([1, 3, 5, 7, 9])
  expect(_range(1, 11, 2)).toEqual([1, 3, 5, 7, 9])
  expect(_range(1, 12, 2)).toEqual([1, 3, 5, 7, 9, 11])
})

test('_times', () => {
  expect(_times(1)).toEqual([0])
  expect(_times(2)).toEqual([0, 1])
  expect(_times(3, i => i * 2)).toEqual([0, 2, 4])
  expect(_times(2, String)).toEqual(['0', '1'])
})
