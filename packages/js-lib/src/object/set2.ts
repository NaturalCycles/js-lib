/**
 * Like Set, but serializes to JSON as an array.
 *
 * Fixes the "issue" of stock Set being json-serialized as `{}`.
 *
 * @experimental
 */
export class Set2<T = any> extends Set<T> {
  toArray(): T[] {
    return [...this]
  }

  toJSON(): T[] {
    return [...this]
  }

  // consider more helpful .toString() ?
}
