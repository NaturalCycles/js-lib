import { HttpError } from '..'
import {
  _capitalize,
  _lowerFirst,
  _split,
  _upperFirst,
  removeWhitespace,
  resultToString,
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
  expect(removeWhitespace(' 1 * A ')).toBe('1*A')
})

const anyItems = [
  undefined,
  null,
  '',
  'hello a',
  0,
  1,
  -5,
  () => 'smth',
  {},
  [],
  ['a'],
  { a: 'aa' },
  new Error('err msg'),
  new HttpError('http err msg', {
    httpStatusCode: 400,
  }),
]

test('resultToString', () => {
  expect(anyItems.map(resultToString)).toMatchSnapshot()
})

test('_split', () => {
  expect(_split('a b c', ' ', 1)).toEqual(['a b c'])
  expect(_split('a b c', ' ', 2)).toEqual(['a', 'b c'])
  expect(_split('a b c', ' ', 3)).toEqual(['a', 'b', 'c'])
})
