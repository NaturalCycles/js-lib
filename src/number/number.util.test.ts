import { _inRange, _randomInt, _sortNumbers } from '../index'
import { _round, _toFixed, _toPrecision } from './number.util'

test('_randomInt', () => {
  const f = _randomInt
  expect(f(0, 0)).toBe(0)

  for (let i = 0; i < 20; i++) {
    const v = f(0, 5)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThanOrEqual(5)
    expect(Math.round(v) === v).toBe(true)
  }
})

test.each([
  [2, 1, 3, true],
  [2, 2, 3, true],
  [2, 2, 1, false],
  [2, 2, 2, false],
  [2, Number.NEGATIVE_INFINITY, 3, true],
])('_inRange(%s, %s, %s) === %s', (n, minIncl, maxExcl, result) => {
  expect(_inRange(n, minIncl, maxExcl)).toBe(result)
})

test.each([
  [1634, 1000, 2000],
  [1634, 500, 1500],
  [1634, 100, 1600],
  [1634, 10, 1630],
  [1634, 1, 1634],
  [1634.123, 1, 1634],
  [1634.5678, 0.1, 1634.6],
  [1634.5678, 0.5, 1634.5],
  [1634.5678, 0.3, 1634.6],
  [1634.5678, 0.01, 1634.57],
  [1634.5678, 0.02, 1634.56],
  [1634.5678, 0.03, 1634.57],
  [1634.5678, 0.05, 1634.55],
])('_round(%s, %s) === %s', (n, precisionUnit, result) => {
  expect(_round(n, precisionUnit)).toBe(result)
})

test.each([
  [0.1604, 1, 0.2],
  [0.1604, 2, 0.16],
  [0.1604, 3, 0.16],
  [0.1604, 4, 0.1604],
  [0.1604, 10, 0.1604],
])('_toFixed(%s, %s) === %s', (n, fractionDigits, result) => {
  expect(_toFixed(n, fractionDigits)).toBe(result)
})

test.each([
  [1634, 1, 2000],
  [1634, 2, 1600],
  [1634, 3, 1630],
  [1634, 4, 1634],
  [1634, 5, 1634],
  [1634.567, 5, 1634.6],
  [1634.567, 6, 1634.57],
  [1634.567, 7, 1634.567],
  [1634.567, 8, 1634.567],
])('_toPrecision(%s, %s) === %s', (n, precision, result) => {
  expect(_toPrecision(n, precision)).toBe(result)
})

test.each([
  [[], []],
  [[3], [3]],
  [
    [3, 1],
    [1, 3],
  ],
  [
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ],
  [
    [1, 2, 4, 3],
    [1, 2, 3, 4],
  ],
  [
    [4, 3, 2, 3],
    [2, 3, 3, 4],
  ],
  [
    [4, 3, 3, 3],
    [3, 3, 3, 4],
  ],
  [
    [4, 1, 3, 1],
    [1, 1, 3, 4],
  ],
])('_sortNumbers %s', (numbers, result) => {
  expect(_sortNumbers(numbers)).toEqual(result)
})
