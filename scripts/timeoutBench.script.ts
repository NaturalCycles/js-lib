/*

yarn tsn timeoutBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { pDelay, pExpectedError, pTimeout } from '../src'

runBenchScript({
  fns: {
    noStack: async done => {
      const err = await pExpectedError(
        pTimeout(pDelay(10, 'v'), { timeout: 1, keepStackTrace: false }),
      )
      const v2 = err.stack
      done.resolve()
    },
    keepStack: async done => {
      const err = await pExpectedError(
        pTimeout(pDelay(10, 'v'), { timeout: 1, keepStackTrace: true }),
      )
      const v2 = err.stack
      done.resolve()
    },
  },
  runs: 2,
})
