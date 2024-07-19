import { _since, pDelay } from '..'
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
const fn = (started: number, n: number): void => inst.fn(started, n)

async function startTimer(fn: AnyFunction, interval: number, count: number): Promise<void> {
  const started = Date.now()

  for (let i = 0; i < count; i++) {
    await pDelay(interval)
    fn(started, i + 1)
  }

  await pDelay(1000) // extra wait
}

test('@debounce', async () => {
  await startTimer(fn, 10, 10)
})
