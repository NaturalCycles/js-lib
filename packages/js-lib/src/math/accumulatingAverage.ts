/**
 * Container that allows to accumulate average of a set of numbers,
 * without the need to store all of them in memory.
 *
 * @experimental
 */
export class AccumulatingAverage {
  total = 0
  count = 0

  /**
   * Returns the current average.
   * Returns 0 if no values have been added.
   */
  get average(): number {
    if (this.count === 0) return 0
    return this.total / this.count
  }

  /**
   * Adds a new value.
   */
  add(value: number): void {
    this.total += value
    this.count++
  }

  reset(): void {
    this.total = 0
    this.count = 0
  }
}
