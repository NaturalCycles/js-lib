import { expectTypeOf } from 'expect-type'
import { _expectedError } from './error/try'
import type {
  Reviver,
  StringMap,
  BaseDBEntity,
  Unsaved,
  UnsavedId,
  AnyObject,
  MonthId,
  Saved,
} from './types'
import {
  _noop,
  _objectAssign,
  _objectEntries,
  _objectKeys,
  _passNothingPredicate,
  _passthroughMapper,
  _passthroughPredicate,
  _passUndefinedMapper,
  _stringMapEntries,
  _stringMapValues,
  _typeCast,
} from './types'
import type { AppError } from '.'

interface Item extends BaseDBEntity {
  a?: number
}

interface ItemDBM extends Item {}

const _ym: MonthId = '2021-01'

test('saved/unsaved', () => {
  const a = 1
  expectTypeOf(a).toEqualTypeOf<number>()

  const o = {
    a: 1,
  }
  expectTypeOf(o).toEqualTypeOf<{
    a: number
  }>()

  expectTypeOf<Item>().toEqualTypeOf<{
    a?: number
    id: string
    created: number
    updated: number
  }>()

  const item = {} as Unsaved<Item>
  delete item.a
  delete item.id
  delete item.created
  delete item.updated

  expectTypeOf(item).toMatchTypeOf<{
    a?: number
    id?: string
    created?: number
    updated?: number
  }>()

  const itemDBM: ItemDBM = {
    id: '5', // should only allow string, but not number
    created: 1,
    updated: 1,
    a: 5,
  }

  delete itemDBM.a

  expectTypeOf(itemDBM).toEqualTypeOf<{
    id: string
    created: number
    updated: number
    a?: number
  }>()

  const savedItemDBM = itemDBM as Saved<ItemDBM>
  expectTypeOf(savedItemDBM).toMatchTypeOf<{
    id: string
    created: number
    updated: number
    a?: number
  }>()

  const unsavedItem: Unsaved<Item> = {}
  delete unsavedItem.id
  delete unsavedItem.created
  delete unsavedItem.updated
  delete unsavedItem.a

  expectTypeOf(unsavedItem).toMatchTypeOf<{
    id?: string
    created?: number
    updated?: number
    a?: number
  }>()

  const unsavedItemDBM: Unsaved<ItemDBM> = {
    a: 5,
  }
  // deletions test that these props exist and are optional
  delete unsavedItemDBM.id
  delete unsavedItemDBM.created
  delete unsavedItemDBM.updated
  delete unsavedItemDBM.a

  expectTypeOf(unsavedItemDBM).toMatchTypeOf<{
    a?: number
    id?: string
    created?: number
    updated?: number
  }>()

  const unsavedItemId: UnsavedId<ItemDBM> = itemDBM
  delete unsavedItemId.id

  expectTypeOf(unsavedItemId).toMatchTypeOf<{
    id?: string
    created: number
    updated: number
    a?: number
  }>()
})

test('types', () => {
  const _reviver: Reviver = (_k, _v) => {}

  expect(_passthroughMapper('a', 1)).toBe('a')
  expect(_passUndefinedMapper('a', 1)).toBeUndefined()
  expect(_passthroughPredicate('a', 1)).toBe(true)
  expect(_passNothingPredicate('a', 1)).toBe(false)

  expect(_noop()).toBeUndefined()
  expect(_noop('hey', 'jude')).toBeUndefined()

  const map: StringMap = { a: 'a', b: 'b', c: undefined }
  const a = map['a']
  expectTypeOf(a).toEqualTypeOf<string | undefined>()
  expectTypeOf(map['b']).toEqualTypeOf<string | undefined>()
  expectTypeOf(map['c']).toEqualTypeOf<string | undefined>()
  expectTypeOf(map['d']).toEqualTypeOf<string | undefined>()
})

test('_stringMapValues, _stringMapEntries', () => {
  const o = { b: 2, c: 3, d: 4 }
  const b = o['b'] // number
  expectTypeOf(b).toEqualTypeOf<number>()

  const values = _stringMapValues(o) // number[]
  expectTypeOf(values).toEqualTypeOf<number[]>()
  expect(values).toEqual([2, 3, 4])

  const entries = _stringMapEntries(o) // [string, number][]
  expectTypeOf(entries).toEqualTypeOf<[string, number][]>()
  expect(entries).toEqual([
    ['b', 2],
    ['c', 3],
    ['d', 4],
  ])

  const entries2 = _objectEntries(o)
  expectTypeOf(entries2).toEqualTypeOf<[keyof typeof o, number][]>()
  expect(entries2).toEqual(entries)

  const keys = _objectKeys(o)
  expectTypeOf(keys).toMatchTypeOf<string[]>()
  expect(keys).toEqual(['b', 'c', 'd'])
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

test('_objectAssign', () => {
  const item = {} as Item

  // No TypeScript error here
  Object.assign(item, {
    whatever: 5,
  })

  _objectAssign(item, {
    // @ts-expect-error 'whatever' does not belong to Partial<Item>
    whatever: 5,
    a: 5,
  })

  expect(item).toMatchInlineSnapshot(`
    {
      "a": 5,
      "whatever": 5,
    }
  `)
})

test('Unsaved type', () => {
  // expectTypeOf<Unsaved<any>>().toEqualTypeOf<any>()

  function _fn<BM extends AnyObject>(_a: Unsaved<BM>): void {}
})
