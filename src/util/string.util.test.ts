import { capitalizeFirstLetter, lowercaseFirstLetter, removeWhitespace } from './string.util'

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('abc')).toBe('Abc')
})

test('lowercaseFirstLetter', () => {
  expect(lowercaseFirstLetter('Abc')).toBe('abc')
})

test('removeWhitespace', () => {
  expect(removeWhitespace(' 1 * A ')).toBe('1*A')
})
