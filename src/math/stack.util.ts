/**
 * Implements a "round-robin" Stack with a limited size.
 * Like an array of a fixed size. When it runs out of space - it starts writing on top of itself
 * from index 0.
 */
export class SizeLimitedStack<T> {
  constructor(public readonly size: number) {}

  /**
   * Index of a slot to get written TO next.
   * Currently this slot contains OLDEST item (if any).
   */
  private nextIndex = 0

  readonly items: T[] = []

  push(item: T): void {
    this.items[this.nextIndex] = item
    this.nextIndex = this.nextIndex === this.size - 1 ? 0 : this.nextIndex + 1
  }

  /**
   * Returns last items in the right order.
   * Unlike raw `items` property that returns "items buffer" as-is (not ordered properly).
   */
  get itemsOrdered(): T[] {
    if (this.items.length < this.size) {
      // Buffer is not filled yet, just return it as-is
      return this.items
    }

    // Buffer was filled and started to "overwrite itself", will need to return 2 slices
    return [...this.items.slice(this.nextIndex), ...this.items.slice(0, this.nextIndex)]
  }
}
