import { inRange, timeSpan } from '../test/test.util'
import { pDelay } from './pDelay'

test('delay', async () => {
  const end = timeSpan()
  await pDelay(100)
  expect(inRange(end(), 90, 160)).toBe(true)
})
