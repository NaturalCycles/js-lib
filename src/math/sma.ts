/**
 * Implements a Simple Moving Average algorithm.
 */
export class SimpleMovingAverage {
  constructor(public size: number, public data: number[] = []) {}

  /**
   * Next index of array to push to
   */
  private nextIndex = 0

  /**
   * Current average (calculated, cached).
   * Returns 0 (not undefined) for empty data.
   */
  avg = 0

  push(n: number): number {
    this.data[this.nextIndex] = n
    this.nextIndex =
      this.nextIndex === this.size - 1
        ? 0 // reset
        : this.nextIndex + 1

    return this.calculateAvg()
  }

  private calculateAvg(): number {
    return (this.avg = this.data.length
      ? this.data.reduce((total, n) => total + n, 0) / this.data.length
      : 0)
  }
}
