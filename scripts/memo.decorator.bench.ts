/*

yarn tsn memo.decorator.bench

 */
/* eslint-disable unused-imports/no-unused-vars */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { _Memo } from '../src'
import { memoSimple } from '../src/decorators/memoSimple.decorator'

let c = 0

class C0 {
  constructor(private inc?: number) {}

  work() {
    // c += this.inc
    c++
  }
}

class C1 {
  getC0() {
    return new C0()
  }
}

class C2 {
  @memoSimple()
  getC0() {
    return new C0()
  }
}

class C3 {
  @_Memo()
  getC0() {
    return new C0()
  }
}

const c1 = new C1()
const c2 = new C2()
const c3 = new C3()
const c0 = c1.getC0()

// const key = {a: 'b'}
// const key = 'a'
const key = 2
// const key = undefined

runBenchScript({
  fns: {
    noMemo: done => {
      // c1.getC0(key as any).work()
      c1.getC0().work()
      // let a = JSON.stringify({a: 'b'})
      done.resolve()
    },
    memoSimple: done => {
      // let a = JSON.stringify(undefined)
      // (c2 as any).getC0('abc').work()
      // c2.getC0(key as any).work()
      c2.getC0().work()
      // c0.work()
      done.resolve()
    },
    memo: done => {
      c3.getC0().work()
      done.resolve()
    },
  },
  runs: 2,
})
