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
export function _range(fromIncl: number, toExcl?: number, step = 1): number[] {
  if (toExcl === undefined) {
    return Array.from(Array(fromIncl), (_, i) => i)
  }

  return Array.from(
    { length: Math.ceil((toExcl - fromIncl) / step) },
    (_, i) => i * step + fromIncl,
  )
}
