/*

yarn tsn startsWithBench

 */

/* eslint-disable */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { _range } from '../src'

const regex = /^{/

// mostly not-json
// const data = mockAllKindsOfThings()
// mostly (only) json
const data = _range(10).map(n => `{ "a": "b", "n": ${n}}`)

runBenchScript({
  fns: {
    startsWith: done => {
      const out = data.map(t => t.startsWith('{'))
      done.resolve()
    },
    regex: done => {
      const out = data.map(t => regex.test(t))
      done.resolve()
    },
  },
  runs: 2,
})
