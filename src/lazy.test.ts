import { _defineLazyProperty, _lazyValue } from './lazy'

test('_lazyValue', () => {
  const fn = jest.fn(() => 42)

  const value = _lazyValue(fn)
  expect(value()).toBe(42)
  expect(value()).toBe(42)
  expect(value()).toBe(42)

  expect(fn).toBeCalledTimes(1)
})

interface Obj {
  v: number
}

test('_defineLazyProperty', () => {
  const fn = jest.fn(() => 42)

  const obj = {} as Obj

  _defineLazyProperty(obj, 'v', fn)

  expect(obj.v).toBe(42)
  expect(obj.v).toBe(42)
  expect(obj.v).toBe(42)

  expect(fn).toBeCalledTimes(1)

  // Another way to declare an object:

  const obj2 = _defineLazyProperty({} as Obj, 'v', fn)
  expect(obj2.v).toBe(42)
})
