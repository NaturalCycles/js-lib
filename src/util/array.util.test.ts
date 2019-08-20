import { _chunk, _flatten, _flattenDeep, _range, _sortBy, _uniq, _uniqBy, by } from './array.util'

test('chunk', () => {
  const a = [1, 2, 3, 4, 5, 6]

  expect(_chunk(a)).toEqual([[1], [2], [3], [4], [5], [6]])

  expect(_chunk(a, 2)).toEqual([[1, 2], [3, 4], [5, 6]])

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

  expect(_uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x')).toEqual([{ x: 1 }, { x: 2 }])
})

test('by', () => {
  expect(by(undefined, 'a')).toEqual({})

  const a = [{ a: 'aa' }, { a: 'ab' }, { b: 'bb' }]
  let r = by(a, 'a')
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })

  r = by(a, v => v.a)
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })

  r = by(a, v => v.a && v.a.toUpperCase())
  expect(r).toEqual({
    AA: { a: 'aa' },
    AB: { a: 'ab' },
  })
})

test('arrayRange', () => {
  expect(_range(3, 6)).toEqual([3, 4, 5])
})

test('_sortBy', () => {
  const a = [{ age: 20 }, { age: 10 }]
  expect(_sortBy(a, 'age')).toEqual([{ age: 10 }, { age: 20 }])
  expect(_sortBy(a, o => o.age)).toEqual([{ age: 10 }, { age: 20 }])
})
