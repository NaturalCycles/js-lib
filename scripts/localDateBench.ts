/*

yarn tsn localDateBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { localDate, localTime } from '../src'

const str = '1984-06-21'

runBenchScript({
  fns: {
    localDate: () => {
      const d = localDate(str)
      const d2 = d.plus(100, 'day')
      const s = d2.toString()
      const _s2 = s
    },
    localTime: () => {
      const d = localTime(str)
      const d2 = d.plus(100, 'day')
      const s = d2.toString()
      const _s2 = s
    },
    dayjs: () => {
      const d = dayjs(str)
      const d2 = d.add(100, 'day')
      const s = d2.toString()
      const _s2 = s
    },
  },
})
