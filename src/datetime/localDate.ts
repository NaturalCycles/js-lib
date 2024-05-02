import { _assert } from '../error/assert'
import { Iterable2 } from '../iter/iterable2'
import type {
  Inclusiveness,
  IsoDateString,
  IsoDateTimeString,
  MonthId,
  SortDirection,
  UnixTimestampMillisNumber,
  UnixTimestampNumber,
} from '../types'
import { ISODayOfWeek, LocalTime } from './localTime'

export type LocalDateUnit = LocalDateUnitStrict | 'week'
export type LocalDateUnitStrict = 'year' | 'month' | 'day'

const MDAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const DATE_REGEX = /^(\d\d\d\d)-(\d\d)-(\d\d)$/

export type LocalDateInput = LocalDate | Date | IsoDateString
export type LocalDateFormatter = (ld: LocalDate) => string

/**
 * @experimental
 */
export class LocalDate {
  private constructor(
    private $year: number,
    private $month: number,
    private $day: number,
  ) {}

  static create(year: number, month: number, day: number): LocalDate {
    return new LocalDate(year, month, day)
  }

  /**
   * Parses input into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  static of(d: LocalDateInput): LocalDate {
    const t = this.parseOrNull(d)

    _assert(t !== null, `Cannot parse "${d}" into LocalDate`, {
      input: d,
    })

    return t
  }

  static parseCompact(d: string): LocalDate {
    const [year, month, day] = [d.slice(0, 4), d.slice(4, 2), d.slice(6, 2)].map(Number)

    _assert(day && month && year, `Cannot parse "${d}" into LocalDate`)

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
  static parseOrNull(d: LocalDateInput | undefined | null): LocalDate | null {
    if (!d) return null
    if (d instanceof LocalDate) return d
    if (d instanceof Date) {
      return this.fromDate(d)
    }

    // const [year, month, day] = d.slice(0, 10).split('-').map(Number)
    const matches = typeof (d as any) === 'string' && DATE_REGEX.exec(d.slice(0, 10))
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

  static sort(items: LocalDate[], mutate = false, dir: SortDirection = 'asc'): LocalDate[] {
    const mod = dir === 'desc' ? -1 : 1
    return (mutate ? items : [...items]).sort((a, b) => a.cmp(b) * mod)
  }

  static earliestOrUndefined(items: LocalDateInput[]): LocalDate | undefined {
    return items.length ? LocalDate.earliest(items) : undefined
  }

  static earliest(items: LocalDateInput[]): LocalDate {
    _assert(items.length, 'LocalDate.earliest called on empty array')

    return items
      .map(i => LocalDate.of(i))
      .reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }

  static latestOrUndefined(items: LocalDateInput[]): LocalDate | undefined {
    return items.length ? LocalDate.latest(items) : undefined
  }

  static latest(items: LocalDateInput[]): LocalDate {
    _assert(items.length, 'LocalDate.latest called on empty array')

    return items
      .map(i => LocalDate.of(i))
      .reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
  }

  get(unit: LocalDateUnitStrict): number {
    return unit === 'year' ? this.$year : unit === 'month' ? this.$month : this.$day
  }

  set(unit: LocalDateUnitStrict, v: number, mutate = false): LocalDate {
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

  dayOfWeek(): ISODayOfWeek {
    return (this.toDate().getDay() || 7) as ISODayOfWeek
  }

  isSame(d: LocalDateInput): boolean {
    d = LocalDate.of(d)
    return this.$day === d.$day && this.$month === d.$month && this.$year === d.$year
  }

  isBefore(d: LocalDateInput, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: LocalDateInput): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: LocalDateInput, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: LocalDateInput): boolean {
    return this.cmp(d) >= 0
  }

  isBetween(min: LocalDateInput, max: LocalDateInput, incl: Inclusiveness = '[)'): boolean {
    let r = this.cmp(min)
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (r < 0 || (r === 0 && incl[0] === '(')) return false
    r = this.cmp(max)
    if (r > 0 || (r === 0 && incl[1] === ')')) return false
    return true
  }

  /**
   * Checks if this localDate is older (<) than "today" by X units.
   *
   * Example:
   *
   * localDate(expirationDate).isOlderThan(5, 'day')
   *
   * Third argument allows to override "today".
   */
  isOlderThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isBefore(LocalDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localDate is same or older (<=) than "today" by X units.
   */
  isSameOrOlderThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isSameOrBefore(LocalDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localDate is younger (>) than "today" by X units.
   *
   * Example:
   *
   * localDate(expirationDate).isYoungerThan(5, 'day')
   *
   * Third argument allows to override "today".
   */
  isYoungerThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isAfter(LocalDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localDate is same or younger (>=) than "today" by X units.
   */
  isSameOrYoungerThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isSameOrAfter(LocalDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalDateInput): -1 | 0 | 1 {
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
  absDiff(d: LocalDateInput, unit: LocalDateUnit): number {
    return Math.abs(this.diff(d, unit))
  }

  /**
   * Returns the number of **full** units difference (aka `Math.floor`).
   *
   * a.diff(b) means "a minus b"
   */
  diff(d: LocalDateInput, unit: LocalDateUnit): number {
    d = LocalDate.of(d)

    const sign = this.cmp(d)
    if (!sign) return 0

    // Put items in descending order: "big minus small"
    const [big, small] = sign === 1 ? [this, d] : [d, this]

    if (unit === 'year') {
      let years = big.$year - small.$year

      if (
        big.$month < small.$month ||
        (big.$month === small.$month &&
          big.$day < small.$day &&
          !(
            big.$day === LocalDate.getMonthLength(big.$year, big.$month) &&
            small.$day === LocalDate.getMonthLength(small.$year, small.$month)
          ))
      ) {
        years--
      }

      return years * sign || 0
    }

    if (unit === 'month') {
      let months = (big.$year - small.$year) * 12 + (big.$month - small.$month)
      if (big.$day < small.$day) {
        const bigMonthLen = LocalDate.getMonthLength(big.$year, big.$month)
        if (big.$day !== bigMonthLen || small.$day < bigMonthLen) {
          months--
        }
      }
      return months * sign || 0
    }

    // unit is 'day' or 'week'
    let days = big.$day - small.$day

    // If small date is after 1st of March - next year's "leapness" should be used
    const offsetYear = small.$month >= 3 ? 1 : 0
    for (let year = small.$year; year < big.$year; year++) {
      days += LocalDate.getYearLength(year + offsetYear)
    }

    if (small.$month < big.$month) {
      for (let month = small.$month; month < big.$month; month++) {
        days += LocalDate.getMonthLength(big.$year, month)
      }
    } else if (big.$month < small.$month) {
      for (let month = big.$month; month < small.$month; month++) {
        days -= LocalDate.getMonthLength(big.$year, month)
      }
    }

    if (unit === 'week') {
      return Math.trunc(days / 7) * sign || 0
    }

    return days * sign || 0
  }

  plus(num: number, unit: LocalDateUnit, mutate = false): LocalDate {
    let { $day, $month, $year } = this

    if (unit === 'week') {
      num *= 7
      unit = 'day'
    }

    if (unit === 'day') {
      $day += num
    } else if (unit === 'month') {
      $month += num
    } else if (unit === 'year') {
      $year += num
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

    // check day overflow
    // Applies not only for 'day' unit, but also e.g 2022-05-31 plus 1 month should be 2022-06-30 (not 31!)
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

      if (unit !== 'day') {
        if ($day > monLen) {
          // Case of 2022-05-31 plus 1 month should be 2022-06-30, not 31
          $day = monLen
        }
      } else {
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

    if (mutate) {
      this.$year = $year
      this.$month = $month
      this.$day = $day
      return this
    }

    return new LocalDate($year, $month, $day)
  }

  minus(num: number, unit: LocalDateUnit, mutate = false): LocalDate {
    return this.plus(-num, unit, mutate)
  }

  startOf(unit: LocalDateUnitStrict): LocalDate {
    if (unit === 'day') return this
    if (unit === 'month') return LocalDate.create(this.$year, this.$month, 1)
    // year
    return LocalDate.create(this.$year, 1, 1)
  }

  endOf(unit: LocalDateUnitStrict): LocalDate {
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

  /**
   * Returns how many days are in the current month.
   * E.g 31 for January.
   */
  daysInMonth(): number {
    return LocalDate.getMonthLength(this.$year, this.$month)
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

  /**
   * Returns e.g: `1984-06-21T17:56:21`
   */
  toISODateTime(): IsoDateTimeString {
    return this.toString() + 'T00:00:00'
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

  toMonthId(): MonthId {
    return this.toString().slice(0, 7)
  }

  // May be not optimal, as LocalTime better suits it
  unix(): UnixTimestampNumber {
    return Math.floor(this.toDate().valueOf() / 1000)
  }

  unixMillis(): UnixTimestampMillisNumber {
    return this.toDate().valueOf()
  }

  toJSON(): IsoDateString {
    return this.toString()
  }

  format(fmt: Intl.DateTimeFormat | LocalDateFormatter): string {
    if (fmt instanceof Intl.DateTimeFormat) {
      return fmt.format(this.toDate())
    }

    return fmt(this)
  }
}

export function localDateRange(
  min: LocalDateInput,
  max: LocalDateInput,
  incl: Inclusiveness = '[)',
  step = 1,
  stepUnit: LocalDateUnit = 'day',
): LocalDate[] {
  return localDateRangeIterable(min, max, incl, step, stepUnit).toArray()
}

/**
 * Experimental, returns the range as Iterable2.
 */
export function localDateRangeIterable(
  min: LocalDateInput,
  max: LocalDateInput,
  incl: Inclusiveness = '[)',
  step = 1,
  stepUnit: LocalDateUnit = 'day',
): Iterable2<LocalDate> {
  if (stepUnit === 'week') {
    step *= 7
    stepUnit = 'day'
  }

  const $min = LocalDate.of(min).startOf(stepUnit)
  const $max = LocalDate.of(max).startOf(stepUnit)

  let value = $min
  // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
  if (value.isAfter($min, incl[0] === '[')) {
    // ok
  } else {
    value.plus(1, stepUnit, true)
  }

  const rightInclusive = incl[1] === ']'

  return Iterable2.of({
    *[Symbol.iterator]() {
      while (value.isBefore($max, rightInclusive)) {
        yield value

        // We don't mutate, because we already returned `current`
        // in the previous iteration
        value = value.plus(step, stepUnit)
      }
    },
  })
}

/**
 * Convenience wrapper around `LocalDate.of`
 */
export function localDate(d: LocalDateInput): LocalDate {
  return LocalDate.of(d)
}

/**
 * Convenience wrapper around `LocalDate.today`
 */
export function localDateToday(): LocalDate {
  return LocalDate.today()
}

/**
 * Creates a LocalDate from the input, unless it's falsy - then returns undefined.
 *
 * `localDate` function will instead return LocalDate of today for falsy input.
 */
export function localDateOrUndefined(d?: LocalDateInput | null): LocalDate | undefined {
  return d ? LocalDate.of(d) : undefined
}

/**
 * Creates a LocalDate from the input, unless it's falsy - then returns LocalDate.today.
 */
export function localDateOrToday(d?: LocalDateInput | null): LocalDate {
  return d ? LocalDate.of(d) : LocalDate.today()
}

/**
 Convenience function to return current today's IsoDateString representation, e.g `2024-06-21`
 */
export function todayString(): IsoDateString {
  // It was benchmarked to be faster than by concatenating individual Date components
  return new Date().toISOString().slice(0, 10)
}
