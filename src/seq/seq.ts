import { AbortableMapper, AbortablePredicate, END, SKIP } from '../types'

/**
 * Inspired by Kotlin Sequences.
 * Similar to arrays, but with lazy evaluation, abortable.
 * Can be useful when it's not feasible/performant to create an array of values to iterate upfront
 * (e.g to construct 1000 Dayjs instances only to find that 2 of them were needed).
 *
 * @experimental
 */
export class Seq<T> implements Iterable<T> {
  private constructor(initialValue: T | typeof END, private nextFn: AbortableMapper<T, T>) {
    this.currentValue = initialValue
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => {
        const value = this.next()
        return value === END ? { done: true, value: undefined } : { value }
      },
    }
  }

  static create<T>(initialValue: T | typeof END, nextFn: AbortableMapper<T, T>): Seq<T> {
    return new Seq(initialValue, nextFn)
  }

  static range(minIncl: number, maxExcl: number, step = 1): Seq<number> {
    const max = maxExcl - step
    return new Seq(minIncl, n => (n < max ? n + step : END))
  }

  static from<T>(a: Iterable<T>): Seq<T> {
    const it = a[Symbol.iterator]()
    const v = it.next()
    if (v.done) return new Seq<any>(END, () => {})

    return new Seq(v.value, () => {
      const v = it.next()
      if (v.done) return END
      return v.value
    })
  }

  static empty<T = any>(): Seq<T> {
    return new Seq(END as any, () => {})
  }

  private currentValue: T | typeof END
  private sentInitialValue = false
  private i = -1

  next(): T | typeof END {
    if (this.currentValue === END) return END

    this.i++

    let v: T | typeof SKIP | typeof END

    if (!this.sentInitialValue) {
      this.sentInitialValue = true
      v = this.currentValue
    } else {
      v = this.nextFn(this.currentValue, this.i)
    }

    // console.log(`_seq`, v)

    if (v === SKIP) return this.next()

    return (this.currentValue = v)
  }

  // Chainable functions - return another (chained) Sequence
  // map<OUT>(mapper: Mapper<T, OUT | typeof SKIP | typeof END>): Seq<OUT> {
  //   if (this.currentValue === END) return this as any
  //
  //   // Iterate until first valid value, to have as `initialValue` of the new Sequence
  //   let v: OUT | typeof SKIP | typeof END
  //
  //   while (true) {
  //     v = mapper(this.currentValue, ++this.i)
  //     if (v === SKIP) continue
  //     if (v === END) return this as any
  //   }
  //
  //   return new Seq<OUT>(v as OUT, (current, i) => {
  //     const v = mapper(current, i)
  //
  //   })
  // }

  // Final functions - return final value, not a chained sequence
  find(predicate: AbortablePredicate<T>): T | undefined {
    do {
      const v = this.next()
      if (v === END) return // not found, end of sequence
      const r = predicate(v, this.i)
      if (r === END) return
      if (r) return v
      // otherwise proceed
    } while (true) // eslint-disable-line no-constant-condition
  }

  some(predicate: AbortablePredicate<T>): boolean {
    do {
      const v = this.next()
      if (v === END) return false
      const r = predicate(v, this.i)
      if (r === END) return false
      if (r) return true
    } while (true) // eslint-disable-line no-constant-condition
  }

  every(predicate: AbortablePredicate<T>): boolean {
    do {
      const v = this.next()
      if (v === END) return true
      const r = predicate(v, this.i)
      if (r === END) return true
      if (!r) return false
    } while (true) // eslint-disable-line no-constant-condition
  }

  toArray(): T[] {
    const a: T[] = []

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const v = this.next()
      if (v === END) return a
      a.push(v)
    }
  }
}

/**
 * Convenience function to create a Sequence.
 */
export function _seq<T>(initialValue: T | typeof END, nextFn: AbortableMapper<T, T>): Seq<T> {
  return Seq.create(initialValue, nextFn)
}
