import {
  Reviver,
  StringMap,
  _noop,
  _objectKeys,
  _passNothingPredicate,
  _passthroughMapper,
  _passthroughPredicate,
  _passUndefinedMapper,
  _stringMapEntries,
  _stringMapValues,
  BaseDBEntity,
  Saved,
} from './types'

interface Item extends BaseDBEntity<number> {
  a?: number
}

interface ItemDBM extends Saved<Item> {}

const _item: ItemDBM = {
  id: 'abc',
  created: 1,
  updated: 1,
}

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

test('_stringMapValues, _stringMapEntries', () => {
  const o = { b: 2, c: 3, d: 4 }
  const _b = o['b'] // number | undefined
  const _values = _stringMapValues(o) // number[]
  const _entries = _stringMapEntries(o) // [string, number][]
  const _keys = _objectKeys(o)
})
