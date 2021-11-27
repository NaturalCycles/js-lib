import { pExpectedError } from '../error/try'
import { pDelay } from '../promise/pDelay'
import { TimeoutError } from '../promise/pTimeout'
import { _Timeout } from './timeout.decorator'

class C {
  constructor(public succeedOnAttempt: number) {}

  @_Timeout({
    timeout: 50,
  })
  async fn(delay: number, value?: any) {
    return await pDelay(delay, value)
  }
}

test('@_Timeout', async () => {
  const c = new C(3)

  expect(await c.fn(10, 'hej')).toBe('hej')

  const err = await pExpectedError(c.fn(200))
  expect(err).toMatchInlineSnapshot(`[TimeoutError: "C.fn" timed out after 50 ms]`)
  expect(err).toBeInstanceOf(TimeoutError)
})
