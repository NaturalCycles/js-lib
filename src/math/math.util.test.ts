import { StringMap, _range } from '..'
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

test.each([
  [[1], 1],
  [[1, 2], 1.5],
  [[1, 2, 3], 2],
  [[2, 3, 10], 5],
])('_average(%s) === %s', (numbers, result) => {
  expect(_average(numbers)).toBe(result)
})

test('_average', () => {
  expect(() => _average([])).toThrow()
})

test('_averageWeighted', () => {
  const weights = numbers.map((_, i) => 1 + 0.1 * i)
  expect(_averageWeighted(numbers, weights)).toBe(39.25869391025641)
})

test.each([
  [[1], 50, 1],
  [[1, 2], 50, 1.5],
  [[1, 3], 50, 2],
  [[1, 2, 3], 50, 2],
  [[1, 2, 3], 75, 2.5],
  [[1, 2, 3, 4], 50, 2.5],
  [[1, 2, 3, 4, 5], 50, 3],
  [[1, 2, 3, 4, 5], 75, 4],
  [[1, 2, 3, 4, 5], 100, 5],
  [[1, 2, 3, 5, 5], 50, 3],
  [[1, 2, 4, 5], 50, 3],
  [[0, 1, 2, 3, 4, 5], 0, 0],
  [[0, 1, 2, 3, 4, 5], 20, 1],
  [[0, 1, 2, 3, 4, 5], 40, 2],
  [[0, 1, 2, 3, 4, 5], 60, 3],
  [[0, 1, 2, 3, 4, 5], 80, 4],
  [[0, 1, 2, 3, 4, 5], 100, 5],
])('_percentile(%s, %s) === %s', (numbers, pc, result) => {
  expect(_percentile(numbers, pc)).toBe(result)
})

test('_percentile', () => {
  const numbers = [1200, 1400]
  const pcs: StringMap<number> = {}
  _range(11).forEach(i => {
    const pc = i * 10
    pcs[pc] = _percentile(numbers, pc)
  })
  // console.log(pcs)
  expect(pcs).toMatchInlineSnapshot(`
    Object {
      "0": 1200,
      "10": 1220,
      "100": 1400,
      "20": 1240,
      "30": 1260,
      "40": 1280,
      "50": 1300,
      "60": 1320,
      "70": 1340,
      "80": 1360,
      "90": 1380,
    }
  `)
})

test('_median', () => {
  expect(_median([1, 2, 3])).toBe(2)
})
