import { mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { expect, test } from 'vitest'
import { JsonParseError } from '../error/error.util'
import { _expectedError } from '../error/try'
import { expectResults } from '../test/test.util'
import { _jsonParse, _jsonParseIfPossible, _jsonParseOrUndefined } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => _jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()

  expect(_jsonParseIfPossible('{"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('  {"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('5')).toBe(5)
  expect(_jsonParseIfPossible('something')).toBe('something')
  expect(_jsonParseIfPossible('{something')).toBe('{something')
})

test('jsonParse', () => {
  const text = 'some raw text'
  const err = _expectedError(() => _jsonParse(text), JsonParseError)
  expect(err).toMatchInlineSnapshot('[JsonParseError: Failed to parse: some raw text]')
  expect(err.data.text).toBe(text)
})

test('jsonParseOrUndefined', () => {
  const f = _jsonParseOrUndefined

  expect(f('{"a": "b"}')).toEqual({ a: 'b' })
  expect(f('  {"a": "b"}')).toEqual({ a: 'b' })
  expect(f('5')).toBe(5)
  expect(f('something')).toBeUndefined()
  expect(f('{something')).toBeUndefined()
})
