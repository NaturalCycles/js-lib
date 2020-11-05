export function _randomInt(minIncl: number, maxIncl: number): number {
  return Math.floor(Math.random() * (maxIncl - minIncl + 1) + minIncl)
}

// todo: _.random to support floats

/**
 *  _inRange(-10, 1, 5) // false
 * _inRange(1, 1, 5) // true
 * _inRange(3, 1, 5) // true
 * _inRange(5, 1, 5) // false
 * _inRange(7, 1, 5) // false
 */
export function _inRange(x: number, minIncl: number, maxExcl: number): boolean {
  return x >= minIncl && x < maxExcl
}

/**
 * This function exists, because in JS you cannot just .sort() numbers,
 * as .sort() function first maps everything to String.
 *
 * @example
 *
 * _sortNumbers([1, 3, 2])
 * // [1, 2, 3]
 */
export function _sortNumbers(numbers: number[], mutate = false): number[] {
  return (mutate ? numbers : [...numbers]).sort((a, b) => Math.sign(a - b))
}
