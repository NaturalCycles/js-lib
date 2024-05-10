/*

yarn tsn errorBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'

// const data = _range(10).map(n => ({err: ''})) as any[]

runBenchScript({
  fns: {
    one: () => {
      const err = new Error('fake')
      const _a = err.stack
    },
    two: () => {
      const fake = { stack: '' }
      Error.captureStackTrace(fake)
      const _a = fake.stack
    },
  },
})
