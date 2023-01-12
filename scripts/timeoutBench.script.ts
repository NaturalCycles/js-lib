/*

yarn tsn timeoutBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { pDelay, pExpectedError, pTimeout } from '../src'

runBenchScript({
  fns: {
    noTimeout: async done => {
      const err = await pExpectedError(
        (async () => {
          await pDelay(1)
          throw new Error('yo')
        })(),
      )
      const v2 = err.stack
      done.resolve()
    },
    withTimeout: async done => {
      const err = await pExpectedError(pTimeout(() => pDelay(10, 'v'), { timeout: 1 }))
      const v2 = err.stack
      done.resolve()
    },
  },
  runs: 2,
})
