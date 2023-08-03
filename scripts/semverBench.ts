/*

yarn tsn semverBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import * as semver from 'semver'
import { _range, _semver } from '../src'

const data = _range(10).map(n => `${n}.${(n * 7) % 10}.${(n * 9) % 7}`)
const data2 = _range(data.length).map(n => `${n}.${Math.round((n * 7.5) % 10)}.${(n * 5) % 7}`)
// console.log(data)

runBenchScript({
  fns: {
    _semver: done => {
      const _a: any[] = []

      _range(data.length).forEach(i => {
        _a.push(_semver(data[i]!).cmp(data2[i]!))
      })

      done.resolve()
    },
    semver: done => {
      const _a: any[] = []

      _range(data.length).forEach(i => {
        _a.push(semver.parse(data[i])!.compare(data2[i]!))
      })

      done.resolve()
    },
  },
  runs: 2,
})
