import type { Inclusiveness, UnixTimestamp } from '../types'
import { LocalTime, localTime, LocalTimeInput } from './localTime'

export type TimeIntervalConfig = TimeInterval | TimeIntervalString
export type TimeIntervalString = string

/**
 * Class that supports an "interval of time" between 2 timestamps - start and end.
 * Example: `1649267185/1649267187`.
 *
 * @experimental
 */
export class TimeInterval {
  private constructor(
    private $start: UnixTimestamp,
    private $end: UnixTimestamp,
  ) {}

  static of(start: LocalTimeInput, end: LocalTimeInput): TimeInterval {
    return new TimeInterval(localTime.fromInput(start).unix, localTime.fromInput(end).unix)
  }

  get start(): UnixTimestamp {
    return this.$start
  }

  get end(): UnixTimestamp {
    return this.$end
  }

  get startTime(): LocalTime {
    return localTime(this.$start)
  }

  get endTime(): LocalTime {
    return localTime(this.$end)
  }

  /**
   * Parses string like `1649267185/1649267187` into a TimeInterval.
   */
  static parse(d: TimeIntervalConfig): TimeInterval {
    if (d instanceof TimeInterval) return d

    const [start, end] = d.split('/').map(Number) as UnixTimestamp[]

    if (!end || !start) {
      throw new Error(`Cannot parse "${d}" into TimeInterval`)
    }

    return new TimeInterval(start, end)
  }

  isSame(d: TimeIntervalConfig): boolean {
    return this.cmp(d) === 0
  }

  isBefore(d: TimeIntervalConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: TimeIntervalConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: TimeIntervalConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: TimeIntervalConfig): boolean {
    return this.cmp(d) >= 0
  }

  includes(d: LocalTimeInput, incl: Inclusiveness = '[)'): boolean {
    d = localTime.fromInput(d).unix
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (d < this.$start || (d === this.$start && incl[0] === '(')) return false
    if (d > this.$end || (d === this.$end && incl[1] === ')')) return false
    return true
  }

  /**
   * TimeIntervals compare by start date.
   * If it's the same - then by end date.
   */
  cmp(d: TimeIntervalConfig): -1 | 0 | 1 {
    d = TimeInterval.parse(d)
    if (this.$start > d.$start) return 1
    if (this.$start < d.$start) return -1
    if (this.$end > d.$end) return 1
    if (this.$end < d.$end) return -1
    return 0
  }

  toString(): TimeIntervalString {
    return [this.$start, this.$end].join('/')
  }

  toJSON(): TimeIntervalString {
    return this.toString()
  }
}
