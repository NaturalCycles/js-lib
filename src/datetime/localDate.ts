import { _assert } from '../error/assert'
import { IsoDateString, UnixTimestampNumber } from '../types'
import { LocalTime } from './localTime'

export type LocalDateUnit = 'year' | 'month' | 'day'
export type Inclusiveness = '()' | '[]' | '[)' | '(]'

const MDAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const DATE_REGEX = /^(\d\d\d\d)-(\d\d)-(\d\d)$/

export type LocalDateConfig = LocalDate | IsoDateString

/* eslint-disable no-dupe-class-members */

/**
 * @experimental
 */
export class LocalDate {
  private constructor(private $year: number, private $month: number, private $day: number) {}

  static create(year: number, month: number, day: number): LocalDate {
    return new LocalDate(year, month, day)
  }

  /**
   * Parses input String into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  static of(d: LocalDateConfig): LocalDate {
    const t = this.parseOrNull(d)

    if (t === null) {
      throw new Error(`Cannot parse "${d}" into LocalDate`)
    }

    return t
  }

  static parseCompact(d: string): LocalDate {
    const [year, month, day] = [d.slice(0, 4), d.slice(4, 2), d.slice(6, 2)].map(Number)

    if (!day || !month || !year) {
      throw new Error(`Cannot parse "${d}" into LocalDate`)
    }

    return new LocalDate(year, month, day)
  }

  static fromDate(d: Date): LocalDate {
    return new LocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }

  static fromDateUTC(d: Date): LocalDate {
    return new LocalDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
  }

  /**
   * Returns null if invalid.
   */
  static parseOrNull(d: LocalDateConfig | undefined | null): LocalDate | null {
    if (!d) return null
    if (d instanceof LocalDate) return d

    // const [year, month, day] = d.slice(0, 10).split('-').map(Number)
    const matches = DATE_REGEX.exec(d.slice(0, 10))
    if (!matches) return null

    const year = Number(matches[1])
    const month = Number(matches[2])
    const day = Number(matches[3])

    if (
      !year ||
      !month ||
      month < 1 ||
      month > 12 ||
      !day ||
      day < 1 ||
      day > this.getMonthLength(year, month)
    ) {
      return null
    }

    return new LocalDate(year, month, day)
  }

  // Can use just .toString()
  // static parseToString(d: LocalDateConfig): IsoDateString {
  //   return typeof d === 'string' ? d : d.toString()
  // }

  static isValid(iso: string | undefined | null): boolean {
    return this.parseOrNull(iso) !== null
  }

  static today(): LocalDate {
    return this.fromDate(new Date())
  }

  static todayUTC(): LocalDate {
    return this.fromDateUTC(new Date())
  }

  static sort(items: LocalDate[], mutate = false, descending = false): LocalDate[] {
    const mod = descending ? -1 : 1
    return (mutate ? items : [...items]).sort((a, b) => a.cmp(b) * mod)
  }

  static earliestOrUndefined(items: LocalDate[]): LocalDate | undefined {
    return items.length ? LocalDate.earliest(items) : undefined
  }

  static earliest(items: LocalDate[]): LocalDate {
    _assert(items.length, 'LocalDate.earliest called on empty array')

    return items.reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }

  static latestOrUndefined(items: LocalDate[]): LocalDate | undefined {
    return items.length ? LocalDate.latest(items) : undefined
  }

  static latest(items: LocalDate[]): LocalDate {
    _assert(items.length, 'LocalDate.latest called on empty array')

    return items.reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
  }

  static range(
    min: LocalDateConfig,
    max: LocalDateConfig,
    incl: Inclusiveness = '[)',
    step = 1,
    stepUnit: LocalDateUnit = 'day',
  ): LocalDate[] {
    const dates: LocalDate[] = []
    const $min = LocalDate.of(min)
    const $max = LocalDate.of(max).startOf(stepUnit)

    let current = $min.startOf(stepUnit)
    if (current.isAfter($min, incl[0] === '[')) {
      // ok
    } else {
      current.add(1, stepUnit, true)
    }

    const incl2 = incl[1] === ']'
    while (current.isBefore($max, incl2)) {
      dates.push(current)
      current = current.add(step, stepUnit)
    }

    return dates
  }

  get(unit: LocalDateUnit): number {
    return unit === 'year' ? this.$year : unit === 'month' ? this.$month : this.$day
  }

  set(unit: LocalDateUnit, v: number, mutate = false): LocalDate {
    const t = mutate ? this : this.clone()

    if (unit === 'year') {
      t.$year = v
    } else if (unit === 'month') {
      t.$month = v
    } else {
      t.$day = v
    }

    return t
  }

  year(): number
  year(v: number): LocalDate
  year(v?: number): number | LocalDate {
    return v === undefined ? this.$year : this.set('year', v)
  }
  month(): number
  month(v: number): LocalDate
  month(v?: number): number | LocalDate {
    return v === undefined ? this.$month : this.set('month', v)
  }
  day(): number
  day(v: number): LocalDate
  day(v?: number): number | LocalDate {
    return v === undefined ? this.$day : this.set('day', v)
  }

  isSame(d: LocalDateConfig): boolean {
    d = LocalDate.of(d)
    return this.$day === d.$day && this.$month === d.$month && this.$year === d.$year
  }

  isBefore(d: LocalDateConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: LocalDateConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: LocalDateConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: LocalDateConfig): boolean {
    return this.cmp(d) >= 0
  }

  isBetween(min: LocalDateConfig, max: LocalDateConfig, incl: Inclusiveness = '[)'): boolean {
    let r = this.cmp(min)
    if (r < 0 || (r === 0 && incl[0] === '(')) return false
    r = this.cmp(max)
    if (r > 0 || (r === 0 && incl[1] === ')')) return false
    return true
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalDateConfig): -1 | 0 | 1 {
    d = LocalDate.of(d)
    if (this.$year < d.$year) return -1
    if (this.$year > d.$year) return 1
    if (this.$month < d.$month) return -1
    if (this.$month > d.$month) return 1
    if (this.$day < d.$day) return -1
    if (this.$day > d.$day) return 1
    return 0
  }

  /**
   * Same as Math.abs( diff )
   */
  absDiff(d: LocalDateConfig, unit: LocalDateUnit): number {
    return Math.abs(this.diff(d, unit))
  }

  /**
   * Returns the number of **full** units difference (aka `Math.ceil`).
   *
   * a.diff(b) means "a minus b"
   */
  diff(d: LocalDateConfig, unit: LocalDateUnit): number {
    d = LocalDate.of(d)

    if (unit === 'year') {
      return this.$year - d.$year
    }

    if (unit === 'month') {
      return (this.$year - d.$year) * 12 + (this.$month - d.$month)
    }

    // unit is 'day'
    let days = this.$day - d.$day

    if (d.$year < this.$year) {
      for (let year = d.$year; year < this.$year; year++) {
        days += LocalDate.getYearLength(year)
      }
    } else if (this.$year < d.$year) {
      for (let year = this.$year; year < d.$year; year++) {
        days -= LocalDate.getYearLength(year)
      }
    }

    if (d.$month < this.$month) {
      for (let month = d.$month; month < this.$month; month++) {
        days += LocalDate.getMonthLength(this.$year, month)
      }
    } else if (this.$month < d.$month) {
      for (let month = this.$month; month < d.$month; month++) {
        days -= LocalDate.getMonthLength(d.$year, month)
      }
    }

    return days
  }

  add(num: number, unit: LocalDateUnit, mutate = false): LocalDate {
    let { $day, $month, $year } = this

    if (unit === 'day') {
      $day += num
    } else if (unit === 'month') {
      $month += num
    } else if (unit === 'year') {
      $year += num
    }

    // check day overflow
    if (unit === 'day') {
      if ($day < 1) {
        while ($day < 1) {
          $month -= 1
          if ($month < 1) {
            $year -= 1
            $month += 12
          }

          $day += LocalDate.getMonthLength($year, $month)
        }
      } else {
        let monLen = LocalDate.getMonthLength($year, $month)

        while ($day > monLen) {
          $day -= monLen
          $month += 1
          if ($month > 12) {
            $year += 1
            $month -= 12
          }

          monLen = LocalDate.getMonthLength($year, $month)
        }
      }
    }

    // check month overflow
    while ($month > 12) {
      $year += 1
      $month -= 12
    }
    while ($month < 1) {
      $year -= 1
      $month += 12
    }

    if (mutate) {
      this.$year = $year
      this.$month = $month
      this.$day = $day
      return this
    }

    return new LocalDate($year, $month, $day)
  }

  subtract(num: number, unit: LocalDateUnit, mutate = false): LocalDate {
    return this.add(-num, unit, mutate)
  }

  startOf(unit: LocalDateUnit): LocalDate {
    if (unit === 'day') return this
    if (unit === 'month') return LocalDate.create(this.$year, this.$month, 1)
    // year
    return LocalDate.create(this.$year, 1, 1)
  }

  endOf(unit: LocalDateUnit): LocalDate {
    if (unit === 'day') return this
    if (unit === 'month')
      return LocalDate.create(
        this.$year,
        this.$month,
        LocalDate.getMonthLength(this.$year, this.$month),
      )
    // year
    return LocalDate.create(this.$year, 12, 31)
  }

  static getYearLength(year: number): number {
    return this.isLeapYear(year) ? 366 : 365
  }

  static getMonthLength(year: number, month: number): number {
    if (month === 2) return this.isLeapYear(year) ? 29 : 28
    return MDAYS[month]!
  }

  static isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  }

  clone(): LocalDate {
    return new LocalDate(this.$year, this.$month, this.$day)
  }

  /**
   * Converts LocalDate into instance of Date.
   * Year, month and day will match.
   * Hour, minute, second, ms will be 0.
   * Timezone will match local timezone.
   */
  toDate(): Date {
    return new Date(this.$year, this.$month - 1, this.$day)
  }

  toLocalTime(): LocalTime {
    return LocalTime.of(this.toDate())
  }

  toISODate(): IsoDateString {
    return this.toString()
  }

  toString(): IsoDateString {
    return [
      String(this.$year).padStart(4, '0'),
      String(this.$month).padStart(2, '0'),
      String(this.$day).padStart(2, '0'),
    ].join('-')
  }

  toStringCompact(): string {
    return [
      String(this.$year).padStart(4, '0'),
      String(this.$month).padStart(2, '0'),
      String(this.$day).padStart(2, '0'),
    ].join('')
  }

  // May be not optimal, as LocalTime better suits it
  unix(): UnixTimestampNumber {
    return Math.floor(this.toDate().valueOf() / 1000)
  }

  unixMillis(): number {
    return this.toDate().valueOf()
  }

  toJSON(): IsoDateString {
    return this.toString()
  }
}

/**
 * Shortcut wrapper around `LocalDate.parse` / `LocalDate.today`
 */
export function localDate(d?: LocalDateConfig): LocalDate {
  return d ? LocalDate.of(d) : LocalDate.today()
}
