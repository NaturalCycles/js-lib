import { _range } from './range'

test('_range', () => {
  expect(_range(3, 6)).toEqual([3, 4, 5])
  expect(_range(6, 3)).toEqual([])
})
