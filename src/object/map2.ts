/**
 * Like Map, but serializes to JSON as an object.
 *
 * Fixes the "issue" of stock Map being json-serialized as `{}`.
 *
 * @experimental
 */
export class Map2<K = any, V = any> extends Map<K, V> {
  /**
   * Convenience way to create Map2 from object.
   */
  static of<V>(obj: Record<any, V>): Map2<string, V> {
    return new Map2(Object.entries(obj))
  }

  toObject(): Record<string, V> {
    return Object.fromEntries(this)
  }

  toJSON(): Record<string, V> {
    return Object.fromEntries(this)
  }

  // consider more helpful .toString() ?
}
