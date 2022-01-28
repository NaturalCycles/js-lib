/*

yarn tsn errorBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'

// const data = _range(10).map(n => ({err: ''})) as any[]

runBenchScript({
  fns: {
    one: done => {
      const err = new Error('fake')
      const _a = err.stack
      done.resolve()
    },
    two: done => {
      const fake = { stack: '' }
      Error.captureStackTrace(fake)
      const _a = fake.stack
      done.resolve()
    },
  },
  runs: 2,
})
