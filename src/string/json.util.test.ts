import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { jsonParseIfPossible } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()
})
