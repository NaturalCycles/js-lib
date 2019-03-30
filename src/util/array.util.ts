/**
 * Polyfill to Array.flat() with depth=1.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 */
export function flatArray<T> (arrays: T[][]): T[] {
  // to flat single level array
  return ([] as T[]).concat(...arrays)
}

/**
 * Removes duplicates from given array.
 */
export function dedupeArray<T> (a: T[]): T[] {
  return [...new Set(a)]
}

/**
 * Returns an array with ranges from `from` up to (but not including) `to`
 *
 * @example
 * getRange(3, 6) // [ 3, 4, 5 ]
 */
export function arrayRange (from: number, to: number): number[] {
  return Array.from({ length: to - from }, (_v, k) => k + from)
}
