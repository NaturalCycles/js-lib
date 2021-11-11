export function _randomInt(minIncl: number, maxIncl: number): number {
  return Math.floor(Math.random() * (maxIncl - minIncl + 1) + minIncl)
}

/**
 * Returns random item from an array.
 * Should be used on non-empty arrays! (otherwise will return undefined,
 * which is not reflected in the output type)
 */
export function _randomArrayItem<T>(array: T[]): T {
  return array[_randomInt(0, array.length - 1)]!
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

export function _clamp(x: number, minIncl: number, maxIncl: number): number {
  return x <= minIncl ? minIncl : x >= maxIncl ? maxIncl : x
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
export function _sortNumbers(numbers: number[], mutate = false, descending = false): number[] {
  const mod = descending ? -1 : 1
  return (mutate ? numbers : [...numbers]).sort((a, b) => (a - b) * mod)
}

/**
 * Same as .toFixed(), but conveniently casts the output to Number.
 *
 * @example
 *
 * _toFixed(1.2345, 2)
 * // 1.23
 *
 * _toFixed(1.10, 2)
 * // 1.1
 */
export function _toFixed(n: number, fractionDigits: number): number {
  return Number(n.toFixed(fractionDigits))
}

/**
 * Same as .toPrecision(), but conveniently casts the output to Number.
 *
 * @example
 *
 * _toPrecision(1634.56, 1)
 * // 2000
 *
 * _toPrecision(1234.56, 2)
 * // 1600
 */
export function _toPrecision(n: number, precision: number): number {
  return Number(n.toPrecision(precision))
}

/**
 * @example
 *
 * _round(1634, 1000) // 2000
 * _round(1634, 500) // 1500
 * _round(1634, 100) // 1600
 * _round(1634, 10) // 1630
 * _round(1634, 1) // 1634
 * _round(1634.5678, 0.1) // 1634.6
 * _round(1634.5678, 0.01) // 1634.57
 */
export function _round(n: number, precisionUnit: number): number {
  if (precisionUnit >= 1) {
    return Math.round(n / precisionUnit) * precisionUnit
  }

  const v = Math.floor(n) + Math.round((n % 1) / precisionUnit) * precisionUnit
  return Number(v.toFixed(String(precisionUnit).length - 2)) // '0.
}
