/**
 * Implements a Simple Moving Average algorithm.
 */
export class SimpleMovingAverage {
  constructor(
    public readonly size: number,
    public readonly data: number[] = [],
  ) {}

  /**
   * Next index of array to push to
   */
  private nextIndex = 0

  /**
   * Current average (calculated on the fly).
   * Returns 0 (not undefined) for empty data.
   */
  get avg(): number {
    if (this.data.length === 0) return 0
    return this.data.reduce((total, n) => total + n, 0) / this.data.length
  }

  /**
   * Push new value.
   * Returns newly calculated average (using newly pushed value).
   */
  pushGetAvg(n: number): number {
    this.push(n)
    return this.avg
  }

  /**
   * Push new value.
   */
  push(n: number): void {
    this.data[this.nextIndex] = n
    this.nextIndex =
      this.nextIndex === this.size - 1
        ? 0 // reset
        : this.nextIndex + 1
  }
}
