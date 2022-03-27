/*

yarn tsn lazyLocalDateBench

 */

/* eslint-disable unused-imports/no-unused-vars */
import { runBenchScript } from '@naturalcycles/bench-lib'
import { LazyLocalDate } from '../src/__exclude/lazyLocalDate'
import { LocalDate } from '../src'

const str = '1984-06-21'

runBenchScript({
  fns: {
    localDate: done => {
      const d = LocalDate.of(str)
      const s = d.toString()
      const s2 = s
      done.resolve()
    },
    lazyLocalDate: done => {
      const d = new LazyLocalDate(str)
      const s = d.toString()
      const s2 = s
      done.resolve()
    },
  },
  runs: 2,
})
