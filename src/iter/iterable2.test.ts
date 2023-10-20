import { _rangeIt } from '../array/range'
import { Iterable2 } from './iterable2'

test('iterable2', () => {
  expect(_rangeIt(3).toArray()).toEqual([0, 1, 2])

  expect(_rangeIt(1, 4).find(v => v % 2 === 0)).toBe(2)

  expect(
    _rangeIt(1, 4)
      .filter(v => v % 2 === 1)
      .toArray(),
  ).toEqual([1, 3])

  expect(
    _rangeIt(1, 4)
      .map(v => v * 2)
      .toArray(),
  ).toEqual([2, 4, 6])

  const a: number[] = []
  _rangeIt(1, 4).forEach(v => a.push(v))
  expect(a).toEqual([1, 2, 3])

  expect(Iterable2.of([]).toArray()).toEqual([])
  expect(Iterable2.empty().toArray()).toEqual([])
  expect(Iterable2.of([3, 4]).toArray()).toEqual([3, 4])
})
