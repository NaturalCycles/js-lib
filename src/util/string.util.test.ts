import { HttpError } from '..'
import {
  capitalizeFirstLetter,
  lowercaseFirstLetter,
  removeWhitespace,
  resultToString,
} from './string.util'

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('abc')).toBe('Abc')
})

test('lowercaseFirstLetter', () => {
  expect(lowercaseFirstLetter('Abc')).toBe('abc')
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
