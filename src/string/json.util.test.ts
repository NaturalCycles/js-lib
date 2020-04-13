import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { jsonParseIfPossible, stringifyAny } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('stringifyAny', () => {
  expectResults(
    v => stringifyAny(v, { noErrorStack: true }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})
