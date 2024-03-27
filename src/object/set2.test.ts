import { expectTypeOf } from 'expect-type'
import { Set2 } from './set2'

/* eslint-disable @typescript-eslint/no-base-to-string */

test('set2', () => {
  const s = new Set([1, 2, 3])
  expect(JSON.stringify(s)).toBe('{}') // boring
  expect(s.toString()).toMatchInlineSnapshot(`"[object Set]"`)

  const s2 = new Set2([1, 2, 3])

  expectTypeOf(s2).toEqualTypeOf<Set2<number>>()
  expect(s2.toArray()).toEqual([1, 2, 3])
  expect(s2.toString()).toMatchInlineSnapshot(`"[object Set]"`)
  expect(s2 instanceof Set2).toBe(true)
  expect(s2 instanceof Set).toBe(true)

  expect(JSON.stringify(s2)).toMatchInlineSnapshot(`"[1,2,3]"`)
})
