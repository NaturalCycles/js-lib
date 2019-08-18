import { pDelay } from '@naturalcycles/promise-lib'
import { timer } from 'rxjs'
import { take, tap } from 'rxjs/operators'
import { since } from '../util/time.util'
import { Debounce } from './debounce.decorator'

class C {
  // @debounce(200, {leading: true, trailing: true})
  // @throttle(200, {leading: true, trailing: true})
  @Debounce(200)
  fn (started: number, n: number): void {
    console.log(`#${n} after ${since(started)}`)
  }
}

const inst = new C()
const fn = (started: number, n: number) => inst.fn(started, n)

async function startTimer (fn: Function, interval: number, count: number): Promise<void> {
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
  await startTimer(fn, 100, 10)
})
