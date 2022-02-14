import { _leven } from './leven'

test('leven', () => {
  expect(_leven('cat', 'cat')).toBe(0)
  expect(_leven('cat', 'bat')).toBe(1)
  expect(_leven('cat', 'octocat')).toBe(4)
})
