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
import { ISODayOfWeek, localTime, LocalTime } from './localTime'

export type LocalDateUnit = LocalDateUnitStrict | 'week'
export type LocalDateUnitStrict = 'year' | 'month' | 'day'

const MDAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const DATE_REGEX = /^(\d\d\d\d)-(\d\d)-(\d\d)$/

export type LocalDateInput = LocalDate | Date | IsoDateString
export type LocalDateFormatter = (ld: LocalDate) => string

/**
 * LocalDate represents a date without time.
 * It is timezone-independent.
 */
export class LocalDate {
  constructor(
    private $year: number,
    private $month: number,
    private $day: number,
  ) {}

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
    d = localDate.of(d)
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
    return this.isBefore(localDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localDate is same or older (<=) than "today" by X units.
   */
  isSameOrOlderThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isSameOrBefore(localDate.of(today || new Date()).plus(-n, unit))
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
    return this.isAfter(localDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localDate is same or younger (>=) than "today" by X units.
   */
  isSameOrYoungerThan(n: number, unit: LocalDateUnit, today?: LocalDateInput): boolean {
    return this.isSameOrAfter(localDate.of(today || new Date()).plus(-n, unit))
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalDateInput): -1 | 0 | 1 {
    d = localDate.of(d)
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
    d = localDate.of(d)

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
            big.$day === localDate.getMonthLength(big.$year, big.$month) &&
            small.$day === localDate.getMonthLength(small.$year, small.$month)
          ))
      ) {
        years--
      }

      return years * sign || 0
    }

    if (unit === 'month') {
      let months = (big.$year - small.$year) * 12 + (big.$month - small.$month)
      if (big.$day < small.$day) {
        const bigMonthLen = localDate.getMonthLength(big.$year, big.$month)
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
      days += localDate.getYearLength(year + offsetYear)
    }

    if (small.$month < big.$month) {
      for (let month = small.$month; month < big.$month; month++) {
        days += localDate.getMonthLength(big.$year, month)
      }
    } else if (big.$month < small.$month) {
      for (let month = big.$month; month < small.$month; month++) {
        days -= localDate.getMonthLength(big.$year, month)
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

        $day += localDate.getMonthLength($year, $month)
      }
    } else {
      let monLen = localDate.getMonthLength($year, $month)

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

          monLen = localDate.getMonthLength($year, $month)
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
    if (unit === 'month') return new LocalDate(this.$year, this.$month, 1)
    // year
    return new LocalDate(this.$year, 1, 1)
  }

  endOf(unit: LocalDateUnitStrict): LocalDate {
    if (unit === 'day') return this
    if (unit === 'month')
      return new LocalDate(
        this.$year,
        this.$month,
        localDate.getMonthLength(this.$year, this.$month),
      )
    // year
    return new LocalDate(this.$year, 12, 31)
  }

  /**
   * Returns how many days are in the current month.
   * E.g 31 for January.
   */
  daysInMonth(): number {
    return localDate.getMonthLength(this.$year, this.$month)
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

  /**
   * Converts LocalDate to Date in UTC timezone.
   * Unlike normal `.toDate` that uses browser's timezone by default.
   */
  toDateInUTC(): Date {
    return new Date(this.toISODateTimeInUTC())
  }

  /**
   * Converts LocalDate to LocalTime with 0 hours, 0 minutes, 0 seconds.
   * LocalTime's Date will be in local timezone.
   */
  toLocalTime(): LocalTime {
    return localTime.of(this.toDate())
  }

  /**
   * Returns e.g: `1984-06-21`
   */
  toISODate(): IsoDateString {
    return [
      String(this.$year).padStart(4, '0'),
      String(this.$month).padStart(2, '0'),
      String(this.$day).padStart(2, '0'),
    ].join('-')
  }

  /**
   * Returns e.g: `1984-06-21T00:00:00`
   * Hours, minutes and seconds are 0.
   */
  toISODateTime(): IsoDateTimeString {
    return this.toISODate() + 'T00:00:00'
  }

  /**
   * Returns e.g: `1984-06-21T00:00:00Z` (notice the Z at the end, which indicates UTC).
   * Hours, minutes and seconds are 0.
   */
  toISODateTimeInUTC(): IsoDateTimeString {
    return this.toISODateTime() + 'Z'
  }

  toString(): IsoDateString {
    return this.toISODate()
  }

  /**
   * Returns e.g: `19840621`
   */
  toStringCompact(): string {
    return [
      String(this.$year).padStart(4, '0'),
      String(this.$month).padStart(2, '0'),
      String(this.$day).padStart(2, '0'),
    ].join('')
  }

  /**
   * Returns e.g: `1984-06`
   */
  toMonthId(): MonthId {
    return this.toISODate().slice(0, 7)
  }

  /**
   * Returns unix timestamp of 00:00:00 of that date (in UTC, because unix timestamp always reflects UTC).
   */
  unix(): UnixTimestampNumber {
    return Math.floor(this.toDate().valueOf() / 1000)
  }

  /**
   * Same as .unix(), but in milliseconds.
   */
  unixMillis(): UnixTimestampMillisNumber {
    return this.toDate().valueOf()
  }

  toJSON(): IsoDateString {
    return this.toISODate()
  }

  format(fmt: Intl.DateTimeFormat | LocalDateFormatter): string {
    if (fmt instanceof Intl.DateTimeFormat) {
      return fmt.format(this.toDate())
    }

    return fmt(this)
  }
}

class LocalDateFactory {
  /**
   * Create LocalDate from year, month and day components.
   */
  create(year: number, month: number, day: number): LocalDate {
    return new LocalDate(year, month, day)
  }

  /**
   * Create LocalDate from LocalDateInput.
   * Input can already be a LocalDate - it is returned as-is in that case.
   * String - will be parsed as yyyy-mm-dd.
   * Date - will be converted to LocalDate (as-is, in whatever timezone it is - local or UTC).
   * No other formats are supported.
   *
   * Will throw if it fails to parse/construct LocalDate.
   */
  of(d: LocalDateInput): LocalDate {
    const t = this.parseOrNull(d)

    _assert(t !== null, `Cannot parse "${d}" into LocalDate`, {
      input: d,
    })

    return t
  }

  /**
   * Tries to construct LocalDate from LocalDateInput, returns null otherwise.
   * Does not throw (returns null instead).
   */
  parseOrNull(d: LocalDateInput | undefined | null): LocalDate | null {
    if (!d) return null
    if (d instanceof LocalDate) return d
    if (d instanceof Date) {
      return this.fromDate(d)
    }

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

  /**
   * Parses "compact iso8601 format", e.g `19840621` into LocalDate.
   * Throws if it fails to do so.
   */
  parseCompact(d: string): LocalDate {
    const [year, month, day] = [d.slice(0, 4), d.slice(4, 2), d.slice(6, 2)].map(Number)

    _assert(day && month && year, `Cannot parse "${d}" into LocalDate`)

    return new LocalDate(year, month, day)
  }

  getYearLength(year: number): number {
    return this.isLeapYear(year) ? 366 : 365
  }

  getMonthLength(year: number, month: number): number {
    if (month === 2) return this.isLeapYear(year) ? 29 : 28
    return MDAYS[month]!
  }

  isLeapYear(year: number): boolean {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  }

  /**
   * Constructs LocalDate from Date.
   * Takes Date as-is, in its timezone - local or UTC.
   */
  fromDate(d: Date): LocalDate {
    return new LocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }

  /**
   * Constructs LocalDate from Date.
   * Takes Date's year/month/day components in UTC, using getUTCFullYear, getUTCMonth, getUTCDate.
   */
  fromDateInUTC(d: Date): LocalDate {
    return new LocalDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())
  }

  /**
   * Returns true if isoString is a valid iso8601 string like `yyyy-mm-dd`.
   */
  isValid(isoString: string | undefined | null): boolean {
    return this.parseOrNull(isoString) !== null
  }

  /**
   * Creates LocalDate that represents `today` (in local timezone).
   */
  today(): LocalDate {
    return this.fromDate(new Date())
  }

  /**
   * Creates LocalDate that represents `today` in UTC.
   */
  todayInUTC(): LocalDate {
    return this.fromDateInUTC(new Date())
  }

  /**
   * Sorts an array of LocalDates in `dir` order (ascending by default).
   */
  sort(items: LocalDate[], dir: SortDirection = 'asc', mutate = false): LocalDate[] {
    const mod = dir === 'desc' ? -1 : 1
    return (mutate ? items : [...items]).sort((a, b) => a.cmp(b) * mod)
  }

  /**
   * Returns the earliest (min) LocalDate from the array, or undefined if the array is empty.
   */
  minOrUndefined(items: LocalDateInput[]): LocalDate | undefined {
    return items.length ? this.min(items) : undefined
  }

  /**
   * Returns the earliest LocalDate from the array.
   * Throws if the array is empty.
   */
  min(items: LocalDateInput[]): LocalDate {
    _assert(items.length, 'localDate.min called on empty array')

    return items.map(i => this.of(i)).reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }

  /**
   * Returns the latest (max) LocalDate from the array, or undefined if the array is empty.
   */
  maxOrUndefined(items: LocalDateInput[]): LocalDate | undefined {
    return items.length ? this.max(items) : undefined
  }

  /**
   * Returns the latest LocalDate from the array.
   * Throws if the array is empty.
   */
  max(items: LocalDateInput[]): LocalDate {
    _assert(items.length, 'localDate.max called on empty array')

    return items.map(i => this.of(i)).reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
  }

  /**
   * Returns the range (array) of LocalDates between min and max.
   * By default, min is included, max is excluded.
   */
  range(
    min: LocalDateInput,
    max: LocalDateInput,
    incl: Inclusiveness = '[)',
    step = 1,
    stepUnit: LocalDateUnit = 'day',
  ): LocalDate[] {
    return this.rangeIterable(min, max, incl, step, stepUnit).toArray()
  }

  /**
   * Returns the Iterable2 of LocalDates between min and max.
   * By default, min is included, max is excluded.
   */
  rangeIterable(
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

    const $min = this.of(min).startOf(stepUnit)
    const $max = this.of(max).startOf(stepUnit)

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
   * Creates a LocalDate from the input, unless it's falsy - then returns undefined.
   *
   * Similar to `localDate.orToday`, but that will instead return Today on falsy input.
   */
  orUndefined(d?: LocalDateInput | null): LocalDate | undefined {
    return d ? this.of(d) : undefined
  }

  /**
   * Creates a LocalDate from the input, unless it's falsy - then returns localDate.today.
   */
  orToday(d?: LocalDateInput | null): LocalDate {
    return d ? this.of(d) : this.today()
  }
}

interface LocalDateFn extends LocalDateFactory {
  (d: LocalDateInput): LocalDate
}

const localDateFactory = new LocalDateFactory()

// export const localDate = Object.assign((d: LocalDateInput) => {
//   return localDateFactory.of(d)
// }, localDateFactory) as LocalDateFn

export const localDate = localDateFactory.of.bind(localDateFactory) as LocalDateFn

// The line below is the blackest of black magic I have ever written in 2024.
// And probably 2023 as well.
Object.setPrototypeOf(localDate, localDateFactory)

/**
 Convenience function to return current today's IsoDateString representation, e.g `2024-06-21`
 */
export function todayString(): IsoDateString {
  return localDate.fromDate(new Date()).toISODate()
}
