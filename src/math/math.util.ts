import { _sortNumbers } from '../number/number.util'

/**
 * @returns Average of the array of numbers
 *
 * @example
 *
 * _average([1, 2, 3, 4])
 * // 2.5
 */
export function _average(values: number[]): number {
  return values.reduce((a, b) => a + b) / values.length
}

/**
 * valuesArray and weightsArray length is expected to be the same.
 */
export function _averageWeighted(values: number[], weights: number[]): number {
  const numerator = values.map((value, i) => value * weights[i]!).reduce((a, b) => a + b)

  const denominator = weights.reduce((a, b) => a + b)

  return numerator / denominator
}

/**
 * @example
 *
 * _percentile([1, 2, 3, 4], 50)
 * // 2.5
 *
 * _percentile([1, 2, 3], 50)
 * // 2
 *
 * _percentile([1, 2, 3], 100)
 * // 3
 */
export function _percentile(values: number[], pc: number): number {
  const sorted = _sortNumbers(values)

  // Floating pos in the range of [0; length - 1]
  const pos = ((values.length - 1) * pc) / 100
  const dec = pos % 1
  const floorPos = Math.floor(pos)
  const ceilPos = Math.ceil(pos)

  return _averageWeighted([sorted[floorPos]!, sorted[ceilPos]!], [1 - dec, dec])
}

/**
 * @example
 *
 * _median([1, 2, 3])
 * // 2
 *
 * _median([1, 2, 3, 4])
 * // 2.5
 */
export function _median(values: number[]): number {
  return _percentile(values, 50)
}
