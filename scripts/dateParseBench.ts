/*

yarn tsn dateParseBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { dayjs } from '@naturalcycles/time-lib'
import { localDate, LocalDate } from '../src'

const strings = LocalDate.range('2022-01-03', '2023-01-05').map(String)
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/

// dayjs x 4,733 ops/sec ±0.31% (90 runs sampled)
// split x 9,200 ops/sec ±1.73% (88 runs sampled)
// regex x 26,494 ops/sec ±1.33% (90 runs sampled)
runBenchScript({
  fns: {
    dayjs: done => {
      let y
      let m
      let d

      strings.forEach(s => {
        const dd = dayjs(s)

        y = dd.year()
        m = dd.month()
        d = dd.day()
      })

      done.resolve()
    },
    split: done => {
      let y
      let m
      let d

      strings.forEach(s => {
        const [year, month, day] = s.slice(0, 10).split('-').map(Number)
        y = year
        m = month
        d = day
      })

      done.resolve()
    },
    regex: done => {
      let y
      let m
      let d

      strings.forEach(s => {
        const matches: string[] | null = DATE.exec(s.slice(0, 10)) as string[]

        y = Number(matches[1])
        m = Number(matches[2])
        d = Number(matches[3])
      })

      done.resolve()
    },
    localDate: done => {
      let y
      let m
      let d

      strings.forEach(s => {
        const dd = localDate(s)

        y = dd.year()
        m = dd.month()
        d = dd.day()
      })

      done.resolve()
    },
  },
  runs: 2,
})
