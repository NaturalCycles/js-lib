import { randomInt } from './random.util'

test('randomInt', () => {
  const f = randomInt
  expect(f(0, 0)).toBe(0)

  for (let i = 0; i < 20; i++) {
    const v = f(0, 5)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThanOrEqual(5)
    expect(Math.round(v) === v).toBe(true)
  }
})
