/*

yarn tsn jsonParseBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _jsonParseIfPossible } from '../src'

// mostly not-json
const data = mockAllKindsOfThings()
// mostly (only) json
// const data = _range(10).map(n => `{ "a": "b", "n": ${n}}`)

runBenchScript({
  fns: {
    before: done => {
      const out = data.map(t => before(t))
      done.resolve()
    },
    after: done => {
      const out = data.map(t => _jsonParseIfPossible(t))
      done.resolve()
    },
  },
  runs: 2,
})

export function before(obj: any, reviver?: (this: any, key: string, value: any) => any): any {
  // Optimization: only try to parse if it looks like JSON: starts with a json possible character
  if (typeof obj === 'string' && obj) {
    try {
      return JSON.parse(obj, reviver)
    } catch {}
  }

  return obj
}
