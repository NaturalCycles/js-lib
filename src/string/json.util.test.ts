import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { JsonParseError } from '../error/jsonParseError'
import { _expectedError } from '../error/try'
import { _jsonParse, _jsonParseIfPossible } from './json.util'

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
  expect(err).toMatchInlineSnapshot(`[JsonParseError: Failed to parse: some raw text]`)
  expect(err.data.text).toBe(text)
})
