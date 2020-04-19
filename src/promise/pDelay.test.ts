import { _inRange } from '..'
import { timeSpan } from '../test/test.util'
import { pDelay } from './pDelay'

test('delay', async () => {
  const end = timeSpan()
  await pDelay(100)
  expect(_inRange(end(), 90, 160)).toBe(true)
})
