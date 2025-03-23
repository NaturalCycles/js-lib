/*

yarn tsx scripts/jsonBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { _range, _safeJsonStringify } from '../src'

const data = _range(10).map(() => mockAllKindsOfThings())

runBenchScript({
  fns: {
    native: () => {
      const _s = JSON.stringify(data)
    },
    safeJsonStringify: () => {
      const _s = _safeJsonStringify(data)
    },
  },
})
