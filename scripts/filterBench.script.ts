/*

yarn tsn filterBench

 */

/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { _filterNullishValues, _range, AnyObject } from '../src'

const objects = _range(1000).map(n => ({
  id: `id_${n}`,
  even: n % 2 === 0,
  n,
  undef: undefined,
  nullish: null,
  s: 'str',
}))

runBenchScript({
  fns: {
    candidate: done => {
      const res = objects.map(o => filterNullishCandidate(o))
      // const res = filterNullishCandidate(objects[0]!)
      done.resolve()
    },
    // candidate2: done => {
    //   const res = objects.map(o => filterNullishCandidate2(o))
    //   // const res = filterNullishCandidate2(objects[0]!)
    //   done.resolve()
    // },
    // filterNullishAsIs: done => {
    //   // const res = objects.map(o => _filterNullishValues(o))
    //   const res = _filterNullishValues(objects[0]!)
    //   done.resolve()
    // },
    // // mutation should come later
    filterNullishMutate: done => {
      const res = objects.map(o => _filterNullishValues(o, true))
      // const res = _filterNullishValues(objects[0]!, true)
      done.resolve()
    },
  },
  runs: 2,
})

function filterNullishCandidate<T extends AnyObject>(obj: T, mutate = false): T {
  const o: any = {}

  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      o[k] = v
    }
  })

  return o
}

function filterNullishCandidate2<T extends AnyObject>(obj: T, mutate = false): T {
  const o: any = {}

  for (const k of Object.keys(obj)) {
    if (obj[k] !== undefined && obj[k] !== null) {
      o[k] = obj[k]
    }
  }

  return o
}
