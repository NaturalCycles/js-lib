/*

pn tsx scripts/timeoutBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'

runBenchScript({
  fns: {
    // noTimeout: async done => {
    //   const err = await pExpectedError(
    //     (async () => {
    //       await pDelay(1)
    //       throw new Error('yo')
    //     })(),
    //   )
    //   const v2 = err.stack
    //   done.resolve()
    // },
    // withTimeout: async done => {
    //   const err = await pExpectedError(pTimeout(() => pDelay(10, 'v'), { timeout: 1 }))
    //   const v2 = err.stack
    //   done.resolve()
    // },
  },
})
