/*

yarn tsx scripts/localDateBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import dayjs from 'dayjs'
import type { IsoDate } from '../src/index.js'
import { localDate, localTime } from '../src/index.js'

const str = '1984-06-21' as IsoDate

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
