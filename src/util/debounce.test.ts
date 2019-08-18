import { pDelay } from '@naturalcycles/promise-lib'
import { timer } from 'rxjs'
import { take, tap } from 'rxjs/operators'
import { _debounce, _throttle } from './debounce'
import { since } from './time.util'

const originalFn = (started: number, n: number) => console.log(`#${n} after ${since(started)}`)

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

  await pDelay(2000) // extra wait
}

test('_debounce', async () => {
  // await runStream(originalFn, 100, 10)
  // await runStream(_debounce(originalFn, 100, { leading: false, trailing: true }), 10, 100)
  // await runStream(_throttle(originalFn, 200, { leading: false, trailing: false }), 10, 100)
  // await pDelay(2000)

  const fn = _debounce(originalFn, 200, { leading: false, trailing: false, maxWait: 300 })
  // const fn = _throttle(originalFn, 200, {leading: false, trailing: false})

  await startTimer(fn, 100, 10)
})

// Test cases:
// _debounce leading=1 trailing=0 (default)
// _debounce leading=1 trailing=1
// _debounce leading=0 trailing=1
// _debounce leading=0 trailing=0
// _throttle leading=1 trailing=1 (default)
// _throttle leading=1 trailing=0
// _throttle leading=0 trailing=1
// _throttle leading=0 trailing=0
