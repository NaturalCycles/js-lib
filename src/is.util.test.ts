import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { expectTypeOf } from 'expect-type'
import { _sum } from './array/array.util'
import {
  _isEmpty,
  _isEmptyObject,
  _isNotEmpty,
  _isNull,
  _isObject,
  _isPrimitive,
  _isTruthy,
} from './is.util'
import { _undefinedIfEmpty } from './object/object.util'
import { SKIP } from './types'

test.each([[undefined], [null], [1], [true], ['hello']] as any[])('isPrimitive "%s"', v => {
  expect(_isPrimitive(v)).toBe(true)
})

test.each([[[]], [{}], [() => {}]] as any[])('!isPrimitive "%s"', v => {
  expect(_isPrimitive(v)).toBe(false)
})

test.each([
  [undefined, true],
  [null, true],
  ['', true],
  [{}, true],
  [[], true],
  [new Map(), true],
  [new Set(), true],
  [0, false],
  [1, false],
  ['a', false],
  [{ a: 'a' }, false],
  [['a'], false],
  [[undefined], false],
  [[{}], false],
  [new Map([['a', 'b']]), false],
  [new Set(['']), false],
  [false, false],
  [true, false],
])('_isEmpty %s == %s', (v, empty) => {
  expect(_isEmpty(v)).toBe(empty)
  expect(_isNotEmpty(v)).toBe(!empty)
  expect(_undefinedIfEmpty(v)).toBe(empty ? undefined : v)
})

test('_isObject', () => {
  const a: any[] = [
    1,
    0,
    -1,
    undefined,
    null,
    'wer',
    'a',
    '',
    {},
    { a: 'b' },
    [],
    /some/,
    () => {},
    SKIP,
  ]
  const r = a.filter(i => _isObject(i))
  expect(r).toEqual([{}, { a: 'b' }, /some/])

  class Obj {}
  expect(_isObject(new Obj())).toBe(true)
})

test('_isEmptyObject', () => {
  const a: any[] = [{}, { a: 'b' }]

  const empty = a.filter(i => _isEmptyObject(i))
  expect(empty).toEqual([{}])
})

test('_isNull', () => {
  expectResults(v => _isNull(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('_isTruthy', () => {
  const a = [1, 2, undefined, null, 3].filter(_isTruthy)
  // This tests that type of a is number[] (no "undefined/null")
  expect(_sum(a)).toBe(6)

  expectTypeOf(a).toEqualTypeOf<number[]>()
})
