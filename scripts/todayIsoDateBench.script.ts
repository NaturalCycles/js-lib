/*

yarn tsn todayIsoDateBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { IsoDateString } from '../src'

runBenchScript({
  fns: {
    v1: done => {
      const s = fn1()
      const _r = s
      done.resolve()
    },
    v2: done => {
      const s = fn2()
      const _r = s
      done.resolve()
    },
  },
  runs: 2,
})

function fn1(): IsoDateString {
  const d = new Date()
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function fn2(): IsoDateString {
  return new Date().toISOString().slice(0, 10)
}

// function fn1(): IsoDateString {
//   return localTimeNow().toPretty()
// }
//
// function fn2(): IsoDateString {
//   return localTimeNow().toPretty2()
// }
