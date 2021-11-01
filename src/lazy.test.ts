import { _defineLazyProperty, _defineLazyProps, _lazyValue } from './lazy'

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

test('_defineLazyProps', () => {
  const fn1 = jest.fn(() => 42)
  const fn2 = jest.fn(() => 48)

  interface Obj2 {
    v1: number
    v2: number
  }

  const obj = {} as Obj2

  _defineLazyProps(obj, {
    v1: fn1,
    v2: fn2,
  })

  expect(obj.v1).toBe(42)
  expect(obj.v1).toBe(42)
  expect(obj.v1).toBe(42)
  expect(fn1).toBeCalledTimes(1)

  expect(obj.v2).toBe(48)
  expect(obj.v2).toBe(48)
  expect(obj.v2).toBe(48)
  expect(fn2).toBeCalledTimes(1)
})
