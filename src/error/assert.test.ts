import { _assert, _assertDeepEquals, _assertEquals } from './assert'

test('_assert', () => {
  _assert(1 === 1) // should not throw

  expect(() => _assert(1 * 1 === 2)).toThrowErrorMatchingInlineSnapshot(
    `"_assert error (see stacktrace)"`,
  )
})

test('_assertEquals', () => {
  // should not throw
  _assertEquals(1, 1)
  _assertEquals('s', 's')
  const obj = {}
  _assertEquals(obj, obj)

  expect(() => _assertEquals(1, 2)).toThrowErrorMatchingInlineSnapshot(
    `"_assertEquals got (1), but expected (2)"`,
  )
})

test('_assertDeepEquals', () => {
  // should not throw
  _assertDeepEquals(1, 1)
  _assertDeepEquals('s', 's')
  _assertDeepEquals({ a: 'a', b: 'b' }, { b: 'b', a: 'a' })

  expect(() => _assertDeepEquals({ a: 'a' }, { a: 'a', b: 'b' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "_assertDeepEquals
    got     : {
      \\"a\\": \\"a\\"
    }
    expected: {
      \\"a\\": \\"a\\",
      \\"b\\": \\"b\\"
    }"
  `)
})
