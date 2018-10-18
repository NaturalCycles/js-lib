import { stringSharedUtil } from './string.shared.util'

test('capitalizeFirstLetter', () => {
  expect(stringSharedUtil.capitalizeFirstLetter('abc')).toBe('Abc')
})

test('removeWhitespace', () => {
  expect(stringSharedUtil.removeWhitespace(' 1 * A ')).toBe('1*A')
})
