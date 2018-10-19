import { stringSharedUtil } from './string.shared.util'

test('capitalizeFirstLetter', () => {
  expect(stringSharedUtil.capitalizeFirstLetter('abc')).toBe('Abc')
})

test('lowercaseFirstLetter', () => {
  expect(stringSharedUtil.lowercaseFirstLetter('Abc')).toBe('abc')
})

test('removeWhitespace', () => {
  expect(stringSharedUtil.removeWhitespace(' 1 * A ')).toBe('1*A')
})
