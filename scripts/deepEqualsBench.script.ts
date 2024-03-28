/*

yarn tsn deepEqualsBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { _deepEquals, _deepJsonEquals, _jsonEquals } from '../src'
import { deepEqualsMocks } from '../src/test/deepEqualsMocks'

// 10 times the cases
const cases = [
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
  ...deepEqualsMocks,
]

runBenchScript({
  fns: {
    deepEquals: done => {
      for (const [v1, v2] of cases) {
        const r = _deepEquals(v1, v2)
        const _r2 = r
      }
      done.resolve()
    },
    deepJsonEquals: done => {
      for (const [v1, v2] of cases) {
        try {
          const r = _deepJsonEquals(v1, v2)
          const _r2 = r
        } catch {}
      }
      done.resolve()
    },
    jsonEquals: done => {
      for (const [v1, v2, jsonEq] of cases) {
        if (jsonEq !== 'error') {
          const r = _jsonEquals(v1, v2)
          const _r2 = r
        }
      }
      done.resolve()
    },
  },
  runs: 2,
})
