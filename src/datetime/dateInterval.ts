import { Inclusiveness, LocalDate, LocalDateConfig, LocalDateUnit } from './localDate'

export type DateIntervalConfig = DateInterval | DateIntervalString
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

  isBefore(d: DateIntervalConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: DateIntervalConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: DateIntervalConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: DateIntervalConfig): boolean {
    return this.cmp(d) >= 0
  }

  /**
   * Ranges of DateInterval (start, end) are INCLUSIVE.
   */
  includes(d: LocalDateConfig, incl: Inclusiveness = '[]'): boolean {
    d = LocalDate.of(d)
    return d.isAfter(this.start, incl[0] === '[') && d.isBefore(this.end, incl[1] === ']')
  }

  intersects(int: DateIntervalConfig, inclusive = true): boolean {
    const $int = DateInterval.parse(int)
    const incl = inclusive ? '[]' : '()'
    return this.includes($int.start, incl) || this.includes($int.end, incl)
  }

  /**
   * DateIntervals compare by start date.
   * If it's the same - then by end date.
   */
  cmp(d: DateIntervalConfig): -1 | 0 | 1 {
    d = DateInterval.parse(d)
    return this.start.cmp(d.start) || this.end.cmp(d.end)
  }

  getDays(incl: Inclusiveness = '[]'): LocalDate[] {
    return LocalDate.range(this.start, this.end, incl, 1, 'day')
  }

  /**
   * Returns an array of LocalDates that are included in the interval.
   */
  range(incl: Inclusiveness = '[]', step = 1, stepUnit: LocalDateUnit = 'day'): LocalDate[] {
    return LocalDate.range(this.start, this.end, incl, step, stepUnit)
  }

  toString(): DateIntervalString {
    return [this.start, this.end].join('/')
  }

  toJSON(): DateIntervalString {
    return this.toString()
  }
}
