import { runBenchScript } from '@naturalcycles/bench-lib'

/* eslint-disable unicorn/no-new-array */
// 'old' range
function _range(fromIncl: number, toExcl?: number, step = 1): number[] {
  if (toExcl === undefined) {
    return Array.from(new Array(fromIncl), (_, i) => i)
  }

  return Array.from(
    { length: Math.ceil((toExcl - fromIncl) / step) },
    (_, i) => i * step + fromIncl,
  )
}

function _rangeWithFor(fromIncl: number, toExcl?: number, step = 1): number[] {
  const arr = []
  if (toExcl === undefined) {
    for (let i = 0; i < fromIncl; i++) {
      arr.push(i)
    }
  } else {
    for (let i = fromIncl; i < toExcl; i += step) {
      arr.push(i)
    }
  }
  return arr
}

function bench(): void {
  runBenchScript({
    fns: {
      range: done => {
        _range(0, 100, 1)
        done.resolve()
      },
      rangeWithFor: done => {
        _rangeWithFor(0, 100, 1)
        done.resolve()
      },
    },
    runs: 5,
  })
}

bench()
