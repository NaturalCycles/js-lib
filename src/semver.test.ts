import { _expectedErrorString } from './error/try'
import { _semver, _semverCompare, Semver } from './semver'

test('basic', () => {
  const s = Semver.of('1.2.3')
  expect(s.toString()).toBe('1.2.3')
  expect(`${s}`).toBe('1.2.3')
  expect(JSON.stringify(s)).toBe('"1.2.3"')
  expect(s.toJSON()).toBe('1.2.3')
  expect(s.tokens).toEqual([1, 2, 3])
  expect(s.major).toBe(1)
  expect(s.minor).toBe(2)
  expect(s.patch).toBe(3)

  const s2 = Semver.of('1.2.5')
  expect(s.cmp(s2)).toBe(-1)
  expect(s.isAfter(s2)).toBe(false)
  expect(s.isSameOrAfter(s2)).toBe(false)
  expect(s.isBefore(s2)).toBe(true)
  expect(s.isSameOrBefore(s2)).toBe(true)
  expect(s.isSame(s2)).toBe(false)
  expect(_semver('1.5.4').isSame('1.5.4')).toBe(true)
  expect(_semver('1.5.4').isSame(_semver('1.5.4'))).toBe(true)

  expect(_expectedErrorString(() => Semver.of(''))).toMatchInlineSnapshot(
    `"AssertionError: Cannot parse "" into Semver"`,
  )
})

test.each([
  [undefined, undefined],
  [null, undefined],
  ['', undefined],
  ['0', '0.0.0'],
  ['1', '1.0.0'],
  ['0.0.1', '0.0.1'],
  ['0.0.1a', '0.0.1'],
  ['0.a0.1a', '0.0.1'],
  ['.a0.1a', '0.0.1'],
  ['.', '0.0.0'],
  ['x', '0.0.0'],
])('parse', (str, expected) => {
  expect(Semver.parseOrNull(str)?.toString()).toBe(expected)
})

test.each([
  ['', '', 0],
  ['a', '', 1],
  ['1', '', 1],
  ['1', '1', 0],
  ['1.', '1', 0],
  ['1.0', '1.0', 0],
  ['1.1', '1.0', 1],
  ['1.1', '1.1.1', -1],
  ['1.1.3', '1.1.51', -1],
  ['1.1.3', '1.1.11', -1],
  ['1.1.11', '1.1.3', 1],
])('_semverCompare "%s" "%s" is %s', (a, b, expected) => {
  expect(_semverCompare(a, b)).toBe(expected)
})
