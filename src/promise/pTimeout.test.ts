import { pDelay } from './pDelay'
import { pTimeout } from './pTimeout'

test('pTimeout happy case', async () => {
  const fn = async (name: string) => await pDelay(10, `hello ${name}`)
  const decoratedFn = pTimeout(fn, { timeout: 100 })
  expect(await decoratedFn('world')).toBe('hello world')
})

test('pTimeout default error', async () => {
  const fn = () => pDelay(100)
  const decoratedFn = pTimeout(fn, { timeout: 10 })
  await expect(decoratedFn()).rejects.toThrowErrorMatchingInlineSnapshot(
    `"\\"fn\\" timed out after 10 ms"`,
  )
})

test('pTimeout options', async () => {
  const fn = () => pDelay(1000)

  await expect(
    pTimeout(fn, { timeout: 100, name: 'custom name' })(),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"\\"custom name\\" timed out after 100 ms"`)

  await expect(
    pTimeout(fn, {
      timeout: 100,
      onTimeout: () => {
        throw new Error('custom error')
      },
    })(),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"custom error"`)

  expect(await pTimeout(fn, { timeout: 100, onTimeout: () => 'all good' })()).toBe('all good')
})
