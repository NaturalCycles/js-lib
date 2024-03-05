/*

yarn tsn setBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'

const a1 = [1, 2, 3, 7, 9]
const a2match = [11, 12, 13, 14, 7, 4, 5]
const a2noMatch = [11, 12, 13, 14, 75, 4, 5]

runBenchScript({
  fns: {
    case1Match: done => {
      const r = _intersectsWith1(a1, a2match)
      const _r2 = r
      done.resolve()
    },
    case2Match: done => {
      const r = _intersectsWith2(a1, a2match)
      const _r2 = r
      done.resolve()
    },
    case1NoMatch: done => {
      const r = _intersectsWith1(a1, a2noMatch)
      const _r2 = r
      done.resolve()
    },
    case2NoMatch: done => {
      const r = _intersectsWith2(a1, a2noMatch)
      const _r2 = r
      done.resolve()
    },
  },
  runs: 2,
})

function _intersectsWith1<T>(a1: T[], a2: T[]): boolean {
  const a2set = new Set(a2)
  return a1.some(v => a2set.has(v))
}

function _intersectsWith2<T>(a1: T[], a2: T[]): boolean {
  return a1.some(v => a2.includes(v))
}
