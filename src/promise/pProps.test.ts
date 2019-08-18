import { pDelay } from './pDelay'
import { pProps } from './pProps'

test('main', async () => {
  const input = {
    foo: pDelay(100).then(() => 1),
    bar: Promise.resolve(2),
    faz: 3,
  }
  const r = await pProps(input)
  expect(r).toEqual({
    foo: 1,
    bar: 2,
    faz: 3,
  })
})

test('rejects if any of the input promises reject', async () => {
  await expect(
    pProps({
      foo: Promise.resolve(1),
      bar: Promise.reject(new Error('bar')),
    }),
  ).rejects.toThrow('bar')
})

test('handles empty object', async () => {
  expect(await pProps({})).toEqual({})
})
