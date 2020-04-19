import { _inRange, _randomInt } from '../index'

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

test('_inRange', () => {
  const f = _inRange
  expect(f(2, 1, 3)).toBe(true)
  expect(f(2, 2, 3)).toBe(true)
  expect(f(2, 1, 2)).toBe(false)
  expect(f(2, 2, 2)).toBe(false)
  expect(f(2, -Infinity, 3)).toBe(true)
})
