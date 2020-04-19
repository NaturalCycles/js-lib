import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { _range } from '..'
import { _ms, _since } from './time.util'

beforeEach(() => {
  mockTime()
})

test('since', () => {
  expect(_since(1000, 1001)).toBe('1 ms')
  expect(_since(1000, 1010)).toBe('10 ms')
})

test('ms', () => {
  expect(_ms(1)).toBe('1 ms')
  expect(_ms(10)).toBe('10 ms')
  expect(_ms(1005)).toBe('1.005 sec')
  expect(_ms(49123)).toBe('49 sec')
  expect(_ms(59123)).toBe('59 sec')
  expect(_ms(59923)).toBe('59 sec')
  expect(_ms(60000)).toBe('1m0s')
  expect(_ms(60912)).toBe('1m0s')
  expect(_ms(69123)).toBe('1m9s')
  expect(_ms(69500)).toBe('1m9s')
  expect(_ms(3292100)).toBe('54m52s')
  expect(_ms(59 * 60 * 1000 + 59 * 1000)).toBe('59m59s')
  expect(_ms(3599500)).toBe('59m59s')
  expect(_ms(3600000)).toBe('1h0m')
  expect(_ms(3732000)).toBe('1h2m')
  expect(_ms(69642430)).toBe('19h20m')
  expect(_ms(92694074)).toBe('26h')
  expect(_ms(101963481)).toBe('28h')
})

test('log progression', () => {
  let m = 1000
  _range(1, 200).forEach(() => {
    console.log(m, _ms(m))
    m = Math.round(m * 1.1)
  })
})
