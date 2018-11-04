import { pProps } from './pProps'
import { promiseSharedUtil } from './promise.shared.util'

const delay = promiseSharedUtil.delay
const m = pProps

test('main', async () => {
  const input = {
    foo: delay(100).then(() => 1),
    bar: Promise.resolve(2),
    faz: 3,
  }
  const r = await m(input)
  expect(r).toEqual({
    foo: 1,
    bar: 2,
    faz: 3,
  })
})

test('rejects if any of the input promises reject', async () => {
  await expect(
    m({
      foo: Promise.resolve(1),
      bar: Promise.reject(new Error('bar')),
    }),
  ).rejects.toThrow('bar')
})

test('handles empty object', async () => {
  expect(await m({})).toEqual({})
})
