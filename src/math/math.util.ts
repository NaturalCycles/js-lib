/**
 * @returns Average of the array of numbers
 *
 * @example
 *
 * _average([1, 2, 3, 4])
 * // 2.5
 */
export function _average(array: number[]): number {
  return array.reduce((a, b) => a + b) / array.length
}

/**
 * valuesArray and weightsArray length is expected to be the same.
 */
export function _averageWeighted(values: number[], weights: number[]): number {
  const numerator = values.map((value, i) => value * weights[i]).reduce((a, b) => a + b)

  const denominator = weights.reduce((a, b) => a + b)

  return numerator / denominator
}
