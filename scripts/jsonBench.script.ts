/*

yarn tsn jsonBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _range, _safeJsonStringify } from '../src'

const data = _range(10).map(() => mockAllKindsOfThings())

runBenchScript({
  fns: {
    native: () => {
      const s = JSON.stringify(data)
    },
    safeJsonStringify: () => {
      const s = _safeJsonStringify(data)
    },
  },
})
