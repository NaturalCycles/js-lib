import { _deepEquals, _deepJsonEquals } from './deepEquals'

test('_deepEquals Issue!', () => {
  expect(
    _deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        b: 2,
        a: 1,
      },
    ),
  ).toBe(true)
})

test('_deepEquals', () => {
  expect(
    _deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        a: 1,
        b: 2,
      },
    ),
  ).toBe(true)

  expect(
    _deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        a: 1,
        b: 2,
        c: 3,
      },
    ),
  ).toBe(false)
})

test('_deepJsonEquals', () => {
  const a = {
    a: 'a',
    b: 'b',
  }
  const b = {
    ...a,
    c: undefined,
  }

  expect(_deepEquals(a, b)).toBe(false)
  expect(_deepJsonEquals(a, b)).toBe(true)
})
