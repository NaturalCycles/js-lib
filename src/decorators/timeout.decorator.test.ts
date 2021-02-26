import { pDelay } from '../promise/pDelay'
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

  await expect(c.fn(200)).rejects.toThrowErrorMatchingInlineSnapshot(
    `"\\"fn\\" timed out after 50 ms"`,
  )
})
