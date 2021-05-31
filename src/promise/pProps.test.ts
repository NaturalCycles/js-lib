import { pDefer } from './pDefer'
import { pDelay } from './pDelay'
import { pProps } from './pProps'

test('main', async () => {
  const defer = pDefer<number>()

  const input = {
    foo: pDelay(100).then(() => 1),
    bar: Promise.resolve(2),
    bar2: defer,
    faz: 3,
  }

  setTimeout(() => defer.resolve(123), 0)

  const r = await pProps(input)
  expect(r).toEqual({
    foo: 1,
    bar: 2,
    bar2: 123,
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
