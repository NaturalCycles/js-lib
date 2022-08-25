import { timer } from 'rxjs'
import { take, tap } from 'rxjs/operators'
import { pDelay, _since } from '..'
import type { AnyFunction } from '../types'
import { _Debounce } from './debounce.decorator'

class C {
  // @debounce(200, {leading: true, trailing: true})
  // @throttle(200, {leading: true, trailing: true})
  @_Debounce(20)
  fn(started: number, n: number): void {
    console.log(`#${n} after ${_since(started)}`)
  }
}

const inst = new C()
const fn = (started: number, n: number) => inst.fn(started, n)

async function startTimer(fn: AnyFunction, interval: number, count: number): Promise<void> {
  const started = Date.now()

  await timer(0, interval)
    .pipe(
      tap(n => {
        // console.log(`timer #${n}: ${since(started)}`)
        fn(started, n + 1)
      }),
      take(count),
    )
    .toPromise()

  await pDelay(1000) // extra wait
}

test('@debounce', async () => {
  await startTimer(fn, 10, 10)
})
