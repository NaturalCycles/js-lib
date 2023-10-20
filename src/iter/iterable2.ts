import { AbortableMapper, AbortablePredicate, END, Predicate, SKIP } from '../types'

/**
 * Iterable2 is a wrapper around Iterable that implements "Iterator Helpers proposal":
 * https://github.com/tc39/proposal-iterator-helpers
 *
 * Iterable2 can be removed after the proposal is widely implemented in Node & browsers.
 *
 * @experimental
 */
export class Iterable2<T> implements Iterable<T> {
  private constructor(private it: Iterable<T>) {}

  static of<T>(it: Iterable<T>): Iterable2<T> {
    return new Iterable2(it)
  }

  static empty<T>(): Iterable2<T> {
    return new Iterable2([])
  }

  [Symbol.iterator](): Iterator<T> {
    return this.it[Symbol.iterator]()
  }

  toArray(): T[] {
    return [...this.it]
  }

  forEach(cb: (v: T, i: number) => any | typeof END): void {
    let i = 0
    for (const v of this.it) {
      if (cb(v, i++) === END) return
    }
  }

  find(cb: Predicate<T>): T | undefined {
    let i = 0
    for (const v of this.it) {
      if (cb(v, i++)) return v
    }
  }

  filter(cb: AbortablePredicate<T>): Iterable2<T> {
    const { it } = this

    return new Iterable2<T>({
      *[Symbol.iterator]() {
        let i = 0
        for (const v of it) {
          const r = cb(v, i++)
          if (r === END) return
          if (r) yield v
        }
      },
    })
  }

  map<OUT>(mapper: AbortableMapper<T, OUT>): Iterable2<OUT> {
    const { it } = this

    return new Iterable2<OUT>({
      *[Symbol.iterator]() {
        let i = 0
        for (const v of it) {
          const r = mapper(v, i++)
          if (r === END) return
          if (r === SKIP) continue
          yield r
        }
      },
    })
  }
}
