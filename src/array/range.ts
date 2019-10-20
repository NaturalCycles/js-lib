/**
 * Returns an array with ranges from `from` up to (but not including) `to`.
 *
 * Right bound is Exclusive (not Inclusive), to comply with lodash _.range
 *
 * @example
 * range(3, 6) // [ 3, 4, 5 ]
 */
export function _range(fromIncl: number, toExcl: number): number[] {
  return Array.from({ length: toExcl - fromIncl }, (_v, k) => k + fromIncl)
}
