import { _hb } from './size.util'

test('hb', () => {
  expect(_hb()).toBe('0 byte(s)')
  expect(_hb(0)).toBe('0 byte(s)')
  expect(_hb(500)).toBe('500 byte(s)')
  expect(_hb(1000)).toBe('1 Kb')
})
