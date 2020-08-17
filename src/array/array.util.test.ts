import { deepFreeze } from '@naturalcycles/dev-lib/dist/testing'
import {
  _by,
  _chunk,
  _countBy,
  _difference,
  _dropRightWhile,
  _dropWhile,
  _findLast,
  _flatten,
  _flattenDeep,
  _intersection,
  _sortBy,
  _takeRightWhile,
  _takeWhile,
  _uniq,
  _uniqBy,
} from './array.util'

test('chunk', () => {
  const a = [1, 2, 3, 4, 5, 6]

  expect(_chunk(a)).toEqual([[1], [2], [3], [4], [5], [6]])

  expect(_chunk(a, 2)).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
  ])

  const b = [1, 2, 3]
  expect(_chunk(b, 2)).toEqual([[1, 2], [3]])

  expect(_chunk([])).toEqual([])
})

test('flatten', () => {
  const a = [[1, 2], [3], [4, 5]]
  expect(_flatten(a)).toEqual([1, 2, 3, 4, 5])
})

test('flattenDeep', () => {
  expect(_flattenDeep([[1, 2], [3], [4, 5]])).toEqual([1, 2, 3, 4, 5])
  expect(_flattenDeep([[1, [2]], [3], [4, 5]])).toEqual([1, 2, 3, 4, 5])
})

test('uniq', () => {
  const a = [1, 2, 2, 1, 3, 5, 3, 4]
  expect(_uniq(a)).toEqual([1, 2, 3, 5, 4])
})

test('uniqBy', () => {
  const a = [1, 2, 2, 1, 3, 5, 3, 4]
  expect(_uniqBy(a, a => a)).toEqual([1, 2, 3, 5, 4])

  expect(_uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2])

  expect(_uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], r => r.x)).toEqual([{ x: 1 }, { x: 2 }])
})

test('by', () => {
  // expect(_by(undefined, (r: any) => r.a)).toEqual({})

  const a = [{ a: 'aa' }, { a: 'ab' }, { b: 'bb' }]
  let r = _by(a, r => r.a)
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })

  r = _by(a, v => v.a)
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })

  r = _by(a, v => v.a?.toUpperCase())
  expect(r).toEqual({
    AA: { a: 'aa' },
    AB: { a: 'ab' },
  })
})

test('_sortBy', () => {
  const a = [{ age: 20 }, { age: 10 }]
  deepFreeze(a)
  expect(_sortBy(a, r => r.age)).toEqual([{ age: 10 }, { age: 20 }])
  expect(_sortBy(a, o => o.age)).toEqual([{ age: 10 }, { age: 20 }])
})

test('_sortBy with mutation', () => {
  const a = [{ age: 20 }, { age: 10 }]
  const r = _sortBy(a, r => r.age, true)
  expect(r).toEqual([{ age: 10 }, { age: 20 }])
  expect(r).toBe(a)
})

test('_findLast', () => {
  expect(_findLast([1, 2, 3, 4], n => n % 2 === 1)).toBe(3)
})

test('_takeWhile', () => {
  expect(_takeWhile([1, 2, 3, 4, 5, 2, 1], v => v <= 3)).toEqual([1, 2, 3])
  expect(_takeWhile([1, 2, 3, 4, 5, 2, 1], v => v > 5)).toEqual([])
})

test('_takeRightWhile', () => {
  expect(_takeRightWhile([1, 2, 3, 4, 5, 2, 1], v => v <= 3)).toEqual([1, 2])
  expect(_takeRightWhile([1, 2, 3, 4, 5, 2, 1], v => v > 5)).toEqual([])
})

test('_dropWhile', () => {
  expect(_dropWhile([1, 2, 3, 4, 5, 2, 1], v => v <= 3)).toEqual([4, 5, 2, 1])
  expect(_dropWhile([1, 2, 3, 4, 5, 2, 1], v => v > 5)).toEqual([1, 2, 3, 4, 5, 2, 1])
  expect(_dropWhile([1, 2, 3, 4, 5, 2, 1], v => v < 10)).toEqual([])
})

test('_dropRightWhile', () => {
  expect(_dropRightWhile([1, 2, 3, 4, 5, 2, 1], v => v <= 3)).toEqual([1, 2, 3, 4, 5])
  expect(_dropRightWhile([1, 2, 3, 4, 5, 2, 1], v => v > 5)).toEqual([1, 2, 3, 4, 5, 2, 1])
  expect(_dropRightWhile([1, 2, 3, 4, 5, 2, 1], v => v < 10)).toEqual([])
})

test('_countBy', () => {
  expect(_countBy(['a', 'aa', 'aaa', 'aaa', 'aaaa'], r => r.length)).toEqual({
    1: 1,
    2: 1,
    3: 2,
    4: 1,
  })

  expect(_countBy([1, 2, 3, 4, 5], n => (n % 2 === 0 ? 'even' : 'odd'))).toEqual({
    even: 2,
    odd: 3,
  })
})

test('_intersection', () => {
  const f = _intersection
  expect(f()).toEqual([])
  expect(f([1])).toEqual([1])
  expect(f([1], [1])).toEqual([1])
  expect(f([1], [1, 2])).toEqual([1])
  expect(f([1], [2])).toEqual([])
  expect(f([2, 1], [2, 3])).toEqual([2])

  expect(f([1], [1], [1])).toEqual([1])
  expect(f([1], [1], [])).toEqual([])
  expect(f([1], [1, 2], [])).toEqual([])
  expect(f([1, 2], [1, 2, 3], [1, 2, 3, 4])).toEqual([1, 2])
})

test('_difference', () => {
  const f = _difference
  expect(f([1])).toEqual([1])
  expect(f([1], [1])).toEqual([])
  expect(f([1], [1, 2])).toEqual([])
  expect(f([1, 2], [2])).toEqual([1])
  expect(f([2, 1], [2, 3])).toEqual([1])
  expect(f([2, 1], [3])).toEqual([2, 1])
  expect(f([2, 4, 1], [3], [2], [3])).toEqual([4, 1])
})
