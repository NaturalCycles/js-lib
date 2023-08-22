import { inspect } from 'node:util'
import { _stringifyAny } from '../string/stringifyAny'
import {
  _assert,
  _assertDeepEquals,
  _assertEquals,
  _assertIsError,
  _assertIsNumber,
  _assertIsString,
} from './assert'
import { AssertionError } from './error.util'
import { _try } from './try'

/* eslint-disable no-self-compare */

test('_assert', () => {
  _assert(1 === 1) // should not throw

  // expect(() => _assert(1 * 1 === 2)).toThrowErrorMatchingInlineSnapshot(`"See stacktrace"`)
  const [err] = _try(() => _assert(1 * 1 === 2))
  expect(err).toBeInstanceOf(AssertionError)
  expect(err).toMatchInlineSnapshot(`[AssertionError: condition failed]`)

  // With custom message
  const err2 = _try(() => _assert(1 * 1 === 2, 'Really should match'))[0]
  expect(err2).toMatchInlineSnapshot(`[AssertionError: Really should match]`)
})

test('_assertEquals', () => {
  // should not throw
  _assertEquals(1, 1)
  _assertEquals('s', 's')
  const obj = {}
  _assertEquals(obj, obj)

  const [err] = _try(() => _assertEquals(1, 2))
  expect(err).toBeInstanceOf(AssertionError)
  expect(_stringifyAny(err, { includeErrorData: true })).toMatchInlineSnapshot(`
    "AssertionError: not equal
    expected: 2
    got     : 1
    {
      "userFriendly": true
    }"
  `)

  const err2 = _try(() => _assertEquals(1, 2, 'Should match'))[0]
  expect(_stringifyAny(err2, { includeErrorData: true })).toMatchInlineSnapshot(`
    "AssertionError: Should match
    {
      "userFriendly": true
    }"
  `)
})

test('_assertDeepEquals', () => {
  // should not throw
  _assertDeepEquals(1, 1)
  _assertDeepEquals('s', 's')
  _assertDeepEquals({ a: 'a', b: 'b' }, { b: 'b', a: 'a' })

  const [err] = _try(() => _assertDeepEquals({ a: 'a' }, { a: 'a', b: 'b' }))
  expect(err).toMatchInlineSnapshot(`
    [AssertionError: not deeply equal
    expected: {
      "a": "a",
      "b": "b"
    }
    got     : {
      "a": "a"
    }]
  `)
})

test('_assertIsError', () => {
  // should not throw
  _assertIsError(new Error('a'))

  const [err] = _try(() => _assertIsError('asd'))
  expect(err).toMatchInlineSnapshot(
    `[AssertionError: Expected to be instanceof Error, actual typeof: string]`,
  )
})

test('_assertIsString', () => {
  // should not throw
  _assertIsString('asd')

  const [err] = _try(() => _assertIsString(5))
  expect(err).toMatchInlineSnapshot(
    `[AssertionError: Expected typeof string, actual typeof: number]`,
  )
})

test('_assertIsNumber', () => {
  // should not throw
  _assertIsNumber(5)

  const [err] = _try(() => _assertIsNumber('asd'))
  expect(err).toMatchInlineSnapshot(
    `[AssertionError: Expected typeof number, actual typeof: string]`,
  )
})

test('AssertionError printability', () => {
  const err = new AssertionError('error', { userFriendly: true })
  // console.log(err)

  expect(err.name).toBe('AssertionError')
  expect(err.constructor.name).toBe('AssertionError')
  expect(err.constructor).toBe(AssertionError)
  const s = filterStackTrace(inspect(err))
  // console.log(s)

  expect(s).not.toContain('constructor')
  expect(s).not.toContain('data')

  expect(err.data).toEqual({ userFriendly: true })
})

function filterStackTrace(s: string): string {
  return s
    .split('\n')
    .filter(line => !line.trimStart().startsWith('at '))
    .join('\n')
}
