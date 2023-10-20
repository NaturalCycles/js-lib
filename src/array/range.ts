import { Iterable2 } from '../iter/iterable2'

/* eslint-disable no-redeclare, unicorn/no-new-array */

/**
 * Returns an array with ranges from `from` up to (but not including) `to`.
 *
 * Right bound is Exclusive (not Inclusive), to comply with lodash _.range
 *
 * @example
 * range(3) // [0, 1, 2]
 * range(3, 6) // [ 3, 4, 5 ]
 * range(1, 10, 2) // [ 1, 3, 5, 7, 9 ]
 */
export function _range(toExcl: number): number[]
export function _range(fromIncl: number, toExcl: number, step?: number): number[]
export function _range(fromIncl: number, toExcl?: number, step = 1): number[] {
  if (toExcl === undefined) {
    return Array.from(new Array(fromIncl), (_, i) => i)
  }

  return Array.from(
    { length: Math.ceil((toExcl - fromIncl) / step) },
    (_, i) => i * step + fromIncl,
  )
}

/**
 * Like _range, but returns an Iterable2.
 */
export function _rangeIt(toExcl: number): Iterable2<number>
export function _rangeIt(fromIncl: number, toExcl: number, step?: number): Iterable2<number>
export function _rangeIt(fromIncl: number, toExcl?: number, step = 1): Iterable2<number> {
  if (toExcl === undefined) {
    toExcl = fromIncl
    fromIncl = 0
  }

  return Iterable2.of({
    *[Symbol.iterator]() {
      for (let i = fromIncl; i < toExcl!; i += step) {
        yield i
      }
    },
  })
}
