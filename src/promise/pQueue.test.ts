import { _range } from '../array/range'
import { pDelay } from '../index'
import { PQueue } from './pQueue'

test('PQueue', async () => {
  const q = new PQueue({
    concurrency: 1,
    debug: true,
  })

  expect(q.inFlight).toBe(0)
  expect(q.queueSize).toBe(0)

  await q.onIdle() // should resolve immediately, cause the queue is empty

  // 5 jobs with delay of 10ms each
  _range(5).forEach(() => {
    q.push(() => pDelay(10))
  })

  q.push(async () => {
    throw new Error('error123')
  })

  await q.onIdle()
})
