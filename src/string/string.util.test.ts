import { _substringAfter, _substringAfterLast, _substringBefore, _substringBeforeLast } from '..'
import {
  _capitalize,
  _lowerFirst,
  _nl2br,
  _removeWhitespace,
  _split,
  _substringBetweenLast,
  _upperFirst,
} from './string.util'

test('capitalize', () => {
  expect(_capitalize('abc')).toBe('Abc')
  expect(_capitalize('aBc')).toBe('Abc')
})

test('upperFirst', () => {
  expect(_upperFirst('abc')).toBe('Abc')
  expect(_upperFirst('aBc')).toBe('ABc')
})

test('lowerFirst', () => {
  expect(_lowerFirst('Abc')).toBe('abc')
})

test('removeWhitespace', () => {
  expect(_removeWhitespace(' 1 * A ')).toBe('1*A')
})

test('_split', () => {
  expect(_split('a b c', ' ', 1)).toEqual(['a b c'])
  expect(_split('a b c', ' ', 2)).toEqual(['a', 'b c'])
  expect(_split('a b c', ' ', 3)).toEqual(['a', 'b', 'c'])
  expect(_split('abc', '|', 3)).toEqual(['abc'])
})

test('substringBefore, substringAfter', () => {
  const s1 = 'someFile.test.ts'
  const s2 = '/Users/lalala/someFile.test.ts'

  expect(_substringBefore(s1, '.')).toBe('someFile')
  expect(_substringAfter(s1, '.')).toBe('test.ts')
  expect(_substringBeforeLast(s2, '/')).toBe(`/Users/lalala`)
  expect(_substringAfterLast(s2, '/')).toBe(`someFile.test.ts`)
})

test('_substringBetweenLast', () => {
  const s = '/Users/lalala/someFile.test.ts'
  expect(_substringBetweenLast(s, '/', '.')).toBe('someFile')
})

test.each([
  ['', ''],
  ['a', 'a'],
  ['a\nb', 'a<br>\nb'],
])('_nl2br("%s") to be "%s"', (input, result) => {
  expect(_nl2br(input)).toBe(result)
})
