import { expectTypeOf } from 'expect-type'
import { AppError } from './error/app.error'
import { _expectedError } from './error/try'
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
  Unsaved,
  UnsavedId,
  _typeCast,
} from './types'

interface Item extends BaseDBEntity<number> {
  a?: number
}

interface ItemDBM extends Saved<Item> {}

const _item: ItemDBM = {
  id: 5, // should only allow number, but not string
  created: 1,
  updated: 1,
}

const _unsavedItem: Unsaved<Item> = {}
const _unsavedItemDBM: Unsaved<ItemDBM> = {}
// deletions test that these props exist and are optional
delete _unsavedItem.id
delete _unsavedItem.created
delete _unsavedItem.updated
delete _unsavedItemDBM.id
delete _unsavedItemDBM.created
delete _unsavedItemDBM.updated

const _unsavedItemId: UnsavedId<ItemDBM> = { ..._item }
delete _unsavedItemDBM.id

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
  const b = o['b'] // number
  expectTypeOf(b).toEqualTypeOf<number>()

  const values = _stringMapValues(o) // number[]
  expectTypeOf(values).toEqualTypeOf<number[]>()

  const entries = _stringMapEntries(o) // [string, number][]
  expectTypeOf(entries).toEqualTypeOf<[string, number][]>()

  const keys = _objectKeys(o)
  expectTypeOf(keys).toMatchTypeOf<string[]>()
})

test('_typeCast', () => {
  const err = _expectedError(() => {
    throw new Error('yo')
  })
  expectTypeOf(err).toEqualTypeOf<Error>()

  _typeCast<AppError>(err)
  expectTypeOf(err).toEqualTypeOf<AppError>()

  err.data = { httpStatusCode: 401 }
  expect(err).toMatchInlineSnapshot(`[Error: yo]`)
  expect(err.data).toMatchInlineSnapshot(`
    {
      "httpStatusCode": 401,
    }
  `)
})
