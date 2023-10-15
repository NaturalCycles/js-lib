/*

yarn tsn localDateBench

 */

/* eslint-disable unused-imports/no-unused-vars */
import { runBenchScript } from '@naturalcycles/bench-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { localDate, localTime } from '../src'

const str = '1984-06-21'

runBenchScript({
  fns: {
    localDate: done => {
      const d = localDate(str)
      const d2 = d.plus(100, 'day')
      const s = d2.toString()
      const s2 = s
      done.resolve()
    },
    localTime: done => {
      const d = localTime(str)
      const d2 = d.plus(100, 'day')
      const s = d2.toString()
      const s2 = s
      done.resolve()
    },
    dayjs: done => {
      const d = dayjs(str)
      const d2 = d.add(100, 'day')
      const s = d2.toString()
      const s2 = s
      done.resolve()
    },
  },
  runs: 2,
})
