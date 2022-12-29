import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _jsonParseIfPossible } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => _jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()

  expect(_jsonParseIfPossible('{"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('  {"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('5')).toBe(5)
  expect(_jsonParseIfPossible('something')).toBe('something')
  expect(_jsonParseIfPossible('{something')).toBe('{something')
})
