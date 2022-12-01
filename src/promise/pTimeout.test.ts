import { pExpectedError } from '../error/try'
import { pDelay } from './pDelay'
import { pTimeout, pTimeoutFn, TimeoutError } from './pTimeout'

test('pTimeoutFn happy case', async () => {
  const fn = async (name: string) => await pDelay(10, `hello ${name}`)
  const decoratedFn = pTimeoutFn(fn, { timeout: 100 })
  expect(await decoratedFn('world')).toBe('hello world')
})

test('pTimeoutFn default error', async () => {
  const fn = () => pDelay(100)
  const decoratedFn = pTimeoutFn(fn, { timeout: 10 })
  const err = await pExpectedError(decoratedFn())
  expect(err).toMatchInlineSnapshot(`[TimeoutError: "fn" timed out after 10 ms]`)
  expect(err).toBeInstanceOf(TimeoutError)
})

test('pTimeoutFn options', async () => {
  const fn = () => pDelay(100)
  const decoratedFn = pTimeoutFn(fn, { timeout: 10, name: 'custom name' })
  const err = await pExpectedError(decoratedFn())
  expect(err).toMatchInlineSnapshot(`[TimeoutError: "custom name" timed out after 10 ms]`)
  expect(err).toBeInstanceOf(TimeoutError)

  await expect(
    pTimeoutFn(fn, {
      timeout: 10,
      onTimeout: () => {
        throw new Error('custom error')
      },
    })(),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"custom error"`)

  expect(await pTimeoutFn(fn, { timeout: 10, onTimeout: () => 'all good' })()).toBe('all good')
})

test('pTimeout happy case', async () => {
  const r = await pTimeout(() => pDelay(10, `hello world`), { timeout: 100 })
  expect(r).toBe('hello world')
})

test('pTimeout stack', async () => {
  const err = await pExpectedError(timeoutFail())

  console.log(err)
  // console.log(err.stack)
  expect(err.stack).toContain('at timeoutFail')
})

async function timeoutFail(): Promise<void> {
  await pTimeout(() => pDelay(100, `hello world`), { timeout: 10, keepStackTrace: true })
}
