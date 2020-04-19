import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _jsonParseIfPossible, _stringifyAny } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => _jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('stringifyAny', () => {
  expectResults(
    v => _stringifyAny(v, { noErrorStack: true }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})
