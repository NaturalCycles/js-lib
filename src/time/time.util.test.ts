import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { _range } from '..'
import { ms, since } from './time.util'

beforeEach(() => {
  mockTime()
})

test('since', () => {
  expect(since(1000, 1001)).toBe('1 ms')
  expect(since(1000, 1010)).toBe('10 ms')
})

test('ms', () => {
  expect(ms(1)).toBe('1 ms')
  expect(ms(10)).toBe('10 ms')
  expect(ms(1005)).toBe('1.005 sec')
  expect(ms(49123)).toBe('49 sec')
  expect(ms(59123)).toBe('59 sec')
  expect(ms(59923)).toBe('59 sec')
  expect(ms(60000)).toBe('1m0s')
  expect(ms(60912)).toBe('1m0s')
  expect(ms(69123)).toBe('1m9s')
  expect(ms(69500)).toBe('1m9s')
  expect(ms(3292100)).toBe('54m52s')
  expect(ms(59 * 60 * 1000 + 59 * 1000)).toBe('59m59s')
  expect(ms(3599500)).toBe('59m59s')
  expect(ms(3600000)).toBe('1h0m')
  expect(ms(3732000)).toBe('1h2m')
  expect(ms(69642430)).toBe('19h20m')
  expect(ms(92694074)).toBe('26h')
  expect(ms(101963481)).toBe('28h')
})

test('log progression', () => {
  let m = 1000
  _range(1, 200).forEach(() => {
    console.log(m, ms(m))
    m = Math.round(m * 1.1)
  })
})
