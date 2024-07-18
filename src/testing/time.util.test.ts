import { MOCK_TS_2018_06_21, mockTime, mockTimeMillis, resetTime } from './time.util'

const now = Date.now()

test('mockTime default', () => {
  expect(new Date().getFullYear()).toBeGreaterThan(2018)

  expect(Date.now()).toBeGreaterThanOrEqual(now)

  mockTime()

  expect(Date.now()).toBe(MOCK_TS_2018_06_21 * 1000)

  resetTime()

  expect(Date.now()).toBeGreaterThanOrEqual(now)

  mockTimeMillis(123_456)

  expect(Date.now()).toBe(123_456)

  resetTime()

  expect(new Date().getFullYear()).toBeGreaterThan(2018)
})
