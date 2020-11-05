import { _average, _averageWeighted, _median, _percentile } from './math.util'

const numbers = [
  32.31,
  36.6,
  39.1,
  40.8,
  66.7,
  97.88,
  103.5,
  30.005, // requires "epsilon trick"
  100.005,
  0,
  1,
  -1,
  10 / 3,
]

test('_average', () => {
  const f = _average
  expect(() => f([])).toThrow()
  expect(f([1])).toBe(1)
  expect(f([1, 2])).toBe(1.5)
  expect(f([1, 2, 3])).toBe(2)
  expect(f([2, 3, 10])).toBe(5)
})

test('_averageWeighted', () => {
  const weights = numbers.map((_, i) => 1 + 0.1 * i)
  expect(_averageWeighted(numbers, weights)).toBe(39.25869391025641)
})

test('_percentile', () => {
  const f = _percentile

  expect(f([1], 50)).toBe(1)
  expect(f([1, 2], 50)).toBe(1.5)
  expect(f([1, 3], 50)).toBe(2)
  expect(f([1, 2, 3], 50)).toBe(2)
  expect(f([1, 2, 3], 75)).toBe(2.5)
  expect(f([1, 2, 3, 4], 50)).toBe(2.5)
  expect(f([1, 2, 3, 4, 5], 50)).toBe(3)
  expect(f([1, 2, 3, 4, 5], 75)).toBe(4)
  expect(f([1, 2, 3, 4, 5], 100)).toBe(5)
  expect(f([1, 1, 3, 5, 5], 50)).toBe(3)
  expect(f([1, 2, 4, 5], 50)).toBe(3)

  expect(f([0, 1, 2, 3, 4, 5], 0)).toBe(0)
  expect(f([0, 1, 2, 3, 4, 5], 20)).toBe(1)
  expect(f([0, 1, 2, 3, 4, 5], 40)).toBe(2)
  expect(f([0, 1, 2, 3, 4, 5], 60)).toBe(3)
  expect(f([0, 1, 2, 3, 4, 5], 80)).toBe(4)
  expect(f([0, 1, 2, 3, 4, 5], 100)).toBe(5)

  expect(_median([1, 2, 3])).toBe(2)
})
