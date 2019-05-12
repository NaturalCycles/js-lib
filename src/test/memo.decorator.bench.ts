/*

yarn tsn ./src/test/memo.decorator.bench.ts

 */
/* tslint:disable:no-unused-variable */

import * as Benchmark from 'benchmark'
import { memo } from '..'
import { memoSimple } from '../decorators/memoSimple.decorator'

let c = 0

class C0 {
  constructor (private inc?: number) {}

  work () {
    // c += this.inc
    c++
  }
}

class C1 {
  getC0 () {
    return new C0()
  }
}

class C2 {
  @memoSimple()
  getC0 () {
    return new C0()
  }
}

class C3 {
  @memo()
  getC0 () {
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

const suite = new Benchmark.Suite()

suite
  .add('no_memo', () => {
    // c1.getC0(key as any).work()
    c1.getC0().work()
    // let a = JSON.stringify({a: 'b'})
  })
  .add('@memoSimple', () => {
    // let a = JSON.stringify(undefined)
    // (c2 as any).getC0('abc').work()
    // c2.getC0(key as any).work()
    c2.getC0().work()
    // c0.work()
  })
  .add('@memo', () => {
    c3.getC0().work()
  })
  // add listeners
  .on('cycle', (event: any) => {
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  // run async
  .run({ async: true })
