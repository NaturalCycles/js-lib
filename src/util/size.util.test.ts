import { hb } from './size.util'

test('hb', () => {
  expect(hb()).toBe('0 byte(s)')
  expect(hb(0)).toBe('0 byte(s)')
  expect(hb(500)).toBe('500 byte(s)')
  expect(hb(1000)).toBe('1 Kb')
})
