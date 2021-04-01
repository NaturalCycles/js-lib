import { _gb, _hb, _kb, _mb } from './size.util'

test('hb', () => {
  expect(_hb()).toBe('0 byte(s)')
  expect(_hb(0)).toBe('0 byte(s)')
  expect(_hb(500)).toBe('500 byte(s)')
  expect(_hb(1000)).toBe('1 Kb')
  expect(_hb(1024 ** 2)).toBe('1 Mb')
  expect(_hb(1024 ** 3)).toBe('1 Gb')
  expect(_kb(1000)).toBe(1)
  expect(_mb(1024 ** 2)).toBe(1)
  expect(_gb(1024 ** 3)).toBe(1)
})
