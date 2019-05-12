import { ms, since } from './time.util'

test('since', () => {
  expect(since(1000, 1001)).toBe('1 ms')
  expect(since(1000, 1010)).toBe('10 ms')
})

test('ms', () => {
  expect(ms(1)).toBe('1 ms')
  expect(ms(10)).toBe('10 ms')
})
