import {
  Reviver,
  StringMap,
  _noop,
  _passNothingPredicate,
  _passthroughMapper,
  _passthroughPredicate,
  _passUndefinedMapper,
} from './types'

test('types', () => {
  const _reviver: Reviver = (_k, _v) => {}

  expect(_passthroughMapper('a', 1)).toBe('a')
  expect(_passUndefinedMapper('a', 1)).toBeUndefined()
  expect(_passthroughPredicate('a', 1)).toBe(true)
  expect(_passNothingPredicate('a', 1)).toBe(false)

  expect(_noop()).toBeUndefined()
  expect(_noop('hey', 'jude')).toBeUndefined()

  const map: StringMap = { a: 'a', b: 'b' }
  const _a = map['a']
})
