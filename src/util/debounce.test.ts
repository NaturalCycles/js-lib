import { pDefer, pDelay } from '@naturalcycles/promise-lib'
import { _debounce, _throttle } from './debounce'

const originalFn = (n: number) => console.log(n)

async function runStream (fn: Function, interval: number, calls: number): Promise<void> {
  const defer = pDefer()
  const started = Date.now()
  let callsDone = 0

  const next = () => {
    callsDone++
    fn(Date.now() - started)
    if (callsDone < calls) {
      setTimeout(next, interval)
    } else {
      defer.resolve()
    }
  }

  next()
  return defer.promise
}

test('_debounce', async () => {
  // await runStream(originalFn, 100, 10)
  await runStream(_debounce(originalFn, 100, { leading: false, trailing: true }), 10, 100)
  // await runStream(_throttle(originalFn, 200, { leading: false, trailing: false }), 10, 100)
  await pDelay(2000)
})
