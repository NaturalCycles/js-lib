import { _truncate } from './truncate'

const s = '1234567890abcd'

test('_truncate', () => {
  expect(_truncate(s, 1)).toBe('...')
  expect(_truncate(s, 2)).toBe('...')
  expect(_truncate(s, 3)).toBe('...')
  expect(_truncate(s, 4)).toBe('1...')
  expect(_truncate(s, 5)).toBe('12...')
  expect(_truncate(s, 10)).toBe('1234567...')
  expect(_truncate(s, 13)).toBe('1234567890...')
  expect(_truncate(s, 14)).toBe('1234567890abcd')
  expect(_truncate(s, 15)).toBe(s)
  expect(_truncate(s, 20)).toBe(s)

  expect(_truncate(s, 1, 'zz')).toBe('zz')
  expect(_truncate(s, 2, 'zz')).toBe('zz')
  expect(_truncate(s, 3, 'zz')).toBe('1zz')
})
