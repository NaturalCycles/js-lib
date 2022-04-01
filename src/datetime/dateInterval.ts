import { LocalDate, LocalDateConfig } from './localDate'

export type DateIntervalConfig = DateInterval | string
export type DateIntervalString = string

/**
 * Class that supports ISO8601 "Time interval" standard that looks like `2022-02-24/2022-03-30`.
 *
 * @experimental
 */
export class DateInterval {
  private constructor(public start: LocalDate, public end: LocalDate) {}

  static of(start: LocalDateConfig, end: LocalDateConfig): DateInterval {
    return new DateInterval(LocalDate.of(start), LocalDate.of(end))
  }

  /**
   * Parses string like `2022-02-24/2023-03-30` into a DateInterval.
   */
  static parse(d: DateIntervalConfig): DateInterval {
    if (d instanceof DateInterval) return d

    const [start, end] = d.split('/')

    if (!end || !start) {
      throw new Error(`Cannot parse "${d}" into DateInterval`)
    }

    return new DateInterval(LocalDate.of(start), LocalDate.of(end))
  }

  isSame(d: DateIntervalConfig): boolean {
    return this.cmp(d) === 0
  }

  isBefore(d: DateIntervalConfig): boolean {
    return this.cmp(d) === -1
  }

  isSameOrBefore(d: DateIntervalConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: DateIntervalConfig): boolean {
    return this.cmp(d) === 1
  }

  isSameOrAfter(d: DateIntervalConfig): boolean {
    return this.cmp(d) >= 0
  }

  /**
   * Ranges of DateInterval (start, end) are INCLUSIVE.
   */
  includes(d: LocalDateConfig): boolean {
    d = LocalDate.of(d)
    return d.isSameOrAfter(this.start) && d.isSameOrBefore(this.end)
  }

  /**
   * DateIntervals compare by start date.
   * If it's the same - then by end date.
   */
  cmp(d: DateIntervalConfig): -1 | 0 | 1 {
    d = DateInterval.parse(d)
    return this.start.cmp(d.start) || this.end.cmp(d.end)
  }

  /**
   * Returns an array of LocalDates that are included in the interval.
   * Ranges are INCLUSIVE.
   */
  getDays(): LocalDate[] {
    const days: LocalDate[] = []
    let current = this.start
    do {
      days.push(current)
      current = current.add(1, 'day')
    } while (current.isSameOrBefore(this.end))

    return days
  }

  toString(): DateIntervalString {
    return [this.start, this.end].join('/')
  }

  toJSON(): DateIntervalString {
    return this.toString()
  }
}
