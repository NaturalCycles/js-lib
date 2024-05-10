/*

yarn tsn lazyLocalDateBench

 */

/* eslint-disable unused-imports/no-unused-vars */
import { runBenchScript } from '@naturalcycles/bench-lib'
// import { LazyLocalDate } from '../src/__exclude/lazyLocalDate'
import { localDate } from '../src'

const str = '1984-06-21'

runBenchScript({
  fns: {
    localDate: () => {
      const d = localDate(str)
      const s = d.toISODate()
      const s2 = s
    },
    // lazyLocalDate: done => {
    //   const d = new LazyLocalDate(str)
    //   const s = d.toISODate()
    //   const s2 = s
    //   done.resolve()
    // },
  },
  runs: 2,
})
