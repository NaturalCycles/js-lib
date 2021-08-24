import { AssertionError, _assert, _assertDeepEquals, _assertEquals } from './assert'
import { _try } from './try'

test('_assert', () => {
  _assert(1 === 1) // should not throw

  // expect(() => _assert(1 * 1 === 2)).toThrowErrorMatchingInlineSnapshot(`"See stacktrace"`)
  const [err] = _try(() => _assert(1 * 1 === 2))
  expect(err).toBeInstanceOf(AssertionError)
  expect(err).toMatchInlineSnapshot(`[AssertionError: see stacktrace]`)

  // With custom message
  const err2 = _try(() => _assert(1 * 1 === 2, 'Really should match'))[0]
  expect(err2).toMatchInlineSnapshot(`[AssertionError: Really should match]`)
})

test('_assertEquals', () => {
  // should not throw
  _assertEquals(1, 1)
  _assertEquals('s', 's')
  const obj = {}
  _assertEquals(obj, obj)

  const [err] = _try(() => _assertEquals(1, 2))
  expect(err).toBeInstanceOf(AssertionError)
  expect(err).toMatchInlineSnapshot(`
    [AssertionError: not equal
    got     : 1
    expected: 2]
  `)

  const err2 = _try(() => _assertEquals(1, 2, 'Should match'))[0]
  expect(err2).toMatchInlineSnapshot(`
    [AssertionError: Should match
    got     : 1
    expected: 2]
  `)
})

test('_assertDeepEquals', () => {
  // should not throw
  _assertDeepEquals(1, 1)
  _assertDeepEquals('s', 's')
  _assertDeepEquals({ a: 'a', b: 'b' }, { b: 'b', a: 'a' })

  const [err] = _try(() => _assertDeepEquals({ a: 'a' }, { a: 'a', b: 'b' }))
  expect(err).toMatchInlineSnapshot(`
    [AssertionError: not deeply equal
    got     : {
      "a": "a"
    }
    expected: {
      "a": "a",
      "b": "b"
    }]
  `)
})
