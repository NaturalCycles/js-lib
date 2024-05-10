import { _assert } from '../error/assert'
import { _ms } from '../time/time.util'
import type {
  Inclusiveness,
  IsoDateString,
  IsoDateTimeString,
  MonthId,
  NumberOfHours,
  NumberOfMinutes,
  SortDirection,
  UnixTimestampMillisNumber,
  UnixTimestampNumber,
} from '../types'
import { localDate, LocalDate } from './localDate'

export type LocalTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'

export enum ISODayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export type LocalTimeInput = LocalTime | Date | IsoDateTimeString | UnixTimestampNumber
export type LocalTimeFormatter = (ld: LocalTime) => string

export type LocalTimeComponents = DateComponents & TimeComponents

interface DateComponents {
  year: number
  month: number
  day: number
}

interface TimeComponents {
  hour: number
  minute: number
  second: number
}

const weekStartsOn = 1 // mon, as per ISO
const MILLISECONDS_IN_WEEK = 604800000
const SECONDS_IN_DAY = 86400
// const MILLISECONDS_IN_DAY = 86400000
// const MILLISECONDS_IN_MINUTE = 60000
const VALID_DAYS_OF_WEEK = new Set([1, 2, 3, 4, 5, 6, 7])

export class LocalTime {
  constructor(public $date: Date) {}

  /**
   * Returns [cloned] LocalTime that is based on the same unixtimestamp, but in UTC timezone.
   * Opposite of `.local()` method.
   */
  utc(): LocalTime {
    return new LocalTime(new Date(this.$date.toISOString()))
  }

  /**
   * Returns [cloned] LocalTime that is based on the same unixtimestamp, but in local timezone.
   * Opposite of `.utc()` method.
   */
  local(): LocalTime {
    return new LocalTime(new Date(this.$date.getTime()))
  }

  get(unit: LocalTimeUnit): number {
    if (unit === 'year') {
      return this.$date.getFullYear()
    }
    if (unit === 'month') {
      return this.$date.getMonth() + 1
    }
    if (unit === 'day') {
      return this.$date.getDate()
    }
    if (unit === 'hour') {
      return this.$date.getHours()
    }
    if (unit === 'minute') {
      return this.$date.getMinutes()
    }
    if (unit === 'week') {
      return getWeek(this.$date)
    }
    // second
    return this.$date.getSeconds()
  }

  set(unit: LocalTimeUnit, v: number, mutate = false): LocalTime {
    const t = mutate ? this : this.clone()

    if (unit === 'year') {
      t.$date.setFullYear(v)
    } else if (unit === 'month') {
      t.$date.setMonth(v - 1)
    } else if (unit === 'day') {
      t.$date.setDate(v)
    } else if (unit === 'hour') {
      t.$date.setHours(v)
    } else if (unit === 'minute') {
      t.$date.setMinutes(v)
    } else if (unit === 'second') {
      t.$date.setSeconds(v)
    } else if (unit === 'week') {
      setWeek(t.$date, v, true)
    }

    return t
  }

  year(): number
  year(v: number): LocalTime
  year(v?: number): number | LocalTime {
    return v === undefined ? this.get('year') : this.set('year', v)
  }
  month(): number
  month(v: number): LocalTime
  month(v?: number): number | LocalTime {
    return v === undefined ? this.get('month') : this.set('month', v)
  }
  week(): number
  week(v: number): LocalTime
  week(v?: number): number | LocalTime {
    return v === undefined ? getWeek(this.$date) : this.set('week', v)
  }
  day(): number
  day(v: number): LocalTime
  day(v?: number): number | LocalTime {
    return v === undefined ? this.get('day') : this.set('day', v)
  }

  /**
   * Based on ISO: 1-7 is Mon-Sun.
   */
  dayOfWeek(): ISODayOfWeek
  dayOfWeek(v: ISODayOfWeek): LocalTime
  dayOfWeek(v?: ISODayOfWeek): ISODayOfWeek | LocalTime {
    const dow = (this.$date.getDay() || 7) as ISODayOfWeek

    if (v === undefined) {
      return dow
    }

    _assert(VALID_DAYS_OF_WEEK.has(v), `Invalid dayOfWeek: ${v}`)

    return this.plus(v - dow, 'day')
  }
  hour(): number
  hour(v: number): LocalTime
  hour(v?: number): number | LocalTime {
    return v === undefined ? this.get('hour') : this.set('hour', v)
  }
  minute(): number
  minute(v: number): LocalTime
  minute(v?: number): number | LocalTime {
    return v === undefined ? this.get('minute') : this.set('minute', v)
  }
  second(): number
  second(v: number): LocalTime
  second(v?: number): number | LocalTime {
    return v === undefined ? this.get('second') : this.set('second', v)
  }

  setComponents(c: Partial<LocalTimeComponents>, mutate = false): LocalTime {
    const d = mutate ? this.$date : new Date(this.$date)

    // Year, month and day set all-at-once, to avoid 30/31 (and 28/29) mishap
    if (c.day || c.month !== undefined || c.year !== undefined) {
      d.setFullYear(
        c.year ?? d.getFullYear(),
        c.month ? c.month - 1 : d.getMonth(),
        c.day || d.getDate(),
      )
    }

    if (c.hour !== undefined) {
      d.setHours(c.hour)
    }
    if (c.minute !== undefined) {
      d.setMinutes(c.minute)
    }
    if (c.second !== undefined) {
      d.setSeconds(c.second)
    }

    return mutate ? this : new LocalTime(d)
  }

  plus(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    if (unit === 'week') {
      num *= 7
      unit = 'day'
    }

    if (unit === 'year' || unit === 'month') {
      const d = addMonths(this.$date, unit === 'month' ? num : num * 12, mutate)
      return mutate ? this : localTime.of(d)
    }

    return this.set(unit, this.get(unit) + num, mutate)
  }

  minus(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    return this.plus(num * -1, unit, mutate)
  }

  absDiff(other: LocalTimeInput, unit: LocalTimeUnit): number {
    return Math.abs(this.diff(other, unit))
  }

  diff(other: LocalTimeInput, unit: LocalTimeUnit): number {
    const date2 = localTime.parseToDate(other)

    const secDiff = (this.$date.valueOf() - date2.valueOf()) / 1000
    if (!secDiff) return 0

    let r

    if (unit === 'year') {
      r = differenceInMonths(this.$date, date2) / 12
    } else if (unit === 'month') {
      r = differenceInMonths(this.$date, date2)
    } else if (unit === 'day') {
      r = secDiff / SECONDS_IN_DAY
    } else if (unit === 'week') {
      r = secDiff / (7 * 24 * 60 * 60)
    } else if (unit === 'hour') {
      r = secDiff / 3600
    } else if (unit === 'minute') {
      r = secDiff / 60
    } else {
      // unit === 'second'
      r = secDiff
    }

    // `|| 0` is to avoid returning -0
    return Math.trunc(r) || 0
  }

  startOf(unit: LocalTimeUnit, mutate = false): LocalTime {
    if (unit === 'second') return this
    const d = mutate ? this.$date : new Date(this.$date)
    d.setSeconds(0, 0)

    if (unit !== 'minute') {
      d.setMinutes(0)
      if (unit !== 'hour') {
        d.setHours(0)
        if (unit !== 'day') {
          // year, month or week

          if (unit === 'year') {
            d.setMonth(0)
            d.setDate(1)
          } else if (unit === 'month') {
            d.setDate(1)
          } else {
            // week
            startOfWeek(d, true)
          }
        }
      }
    }

    return mutate ? this : new LocalTime(d)
  }

  endOf(unit: LocalTimeUnit, mutate = false): LocalTime {
    if (unit === 'second') return this
    const d = mutate ? this.$date : new Date(this.$date)
    d.setSeconds(59, 0)

    if (unit !== 'minute') {
      d.setMinutes(59)
      if (unit !== 'hour') {
        d.setHours(23)
        if (unit !== 'day') {
          // year, month or week

          if (unit === 'year') {
            d.setMonth(11)
          }

          if (unit === 'week') {
            endOfWeek(d, true)
          } else {
            // year or month
            const lastDay = localDate.getMonthLength(d.getFullYear(), d.getMonth() + 1)
            d.setDate(lastDay)
          }
        }
      }
    }

    return mutate ? this : new LocalTime(d)
  }

  /**
   * Returns how many days are in the current month.
   * E.g 31 for January.
   */
  daysInMonth(): number {
    return localDate.getMonthLength(this.$date.getFullYear(), this.$date.getMonth() + 1)
  }

  isSame(d: LocalTimeInput): boolean {
    return this.cmp(d) === 0
  }

  isBefore(d: LocalTimeInput, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: LocalTimeInput): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: LocalTimeInput, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: LocalTimeInput): boolean {
    return this.cmp(d) >= 0
  }

  isBetween(min: LocalTimeInput, max: LocalTimeInput, incl: Inclusiveness = '[)'): boolean {
    let r = this.cmp(min)
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (r < 0 || (r === 0 && incl[0] === '(')) return false
    r = this.cmp(max)
    if (r > 0 || (r === 0 && incl[1] === ')')) return false
    return true
  }

  /**
   * Checks if this localTime is older (<) than "now" by X units.
   *
   * Example:
   *
   * localTime(expirationDate).isOlderThan(5, 'day')
   *
   * Third argument allows to override "now".
   */
  isOlderThan(n: number, unit: LocalTimeUnit, now?: LocalTimeInput): boolean {
    return this.isBefore(localTime.of(now ?? new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localTime is same or older (<=) than "now" by X units.
   */
  isSameOrOlderThan(n: number, unit: LocalTimeUnit, now?: LocalTimeInput): boolean {
    return this.isSameOrBefore(localTime.of(now ?? new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localTime is younger (>) than "now" by X units.
   *
   * Example:
   *
   * localTime(expirationDate).isYoungerThan(5, 'day')
   *
   * Third argument allows to override "now".
   */
  isYoungerThan(n: number, unit: LocalTimeUnit, now?: LocalTimeInput): boolean {
    return this.isAfter(localTime.of(now ?? new Date()).plus(-n, unit))
  }

  /**
   * Checks if this localTime is same or younger (>=) than "now" by X units.
   */
  isSameOrYoungerThan(n: number, unit: LocalTimeUnit, now?: LocalTimeInput): boolean {
    return this.isSameOrAfter(localTime.of(now ?? new Date()).plus(-n, unit))
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalTimeInput): -1 | 0 | 1 {
    const t1 = this.$date.valueOf()
    const t2 = localTime.parseToDate(d).valueOf()
    if (t1 === t2) return 0
    return t1 < t2 ? -1 : 1
  }

  components(): LocalTimeComponents {
    return {
      ...this.dateComponents(),
      ...this.timeComponents(),
    }
  }

  private dateComponents(): DateComponents {
    return {
      year: this.$date.getFullYear(),
      month: this.$date.getMonth() + 1,
      day: this.$date.getDate(),
    }
  }

  private timeComponents(): TimeComponents {
    return {
      hour: this.$date.getHours(),
      minute: this.$date.getMinutes(),
      second: this.$date.getSeconds(),
    }
  }

  fromNow(now: LocalTimeInput = new Date()): string {
    const msDiff = localTime.parseToDate(now).valueOf() - this.$date.valueOf()

    if (msDiff === 0) return 'now'

    if (msDiff >= 0) {
      return `${_ms(msDiff)} ago`
    }

    return `in ${_ms(msDiff * -1)}`
  }

  getDate(): Date {
    return this.$date
  }

  clone(): LocalTime {
    return new LocalTime(new Date(this.$date))
  }

  unix(): UnixTimestampNumber {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  unixMillis(): UnixTimestampMillisNumber {
    return this.$date.valueOf()
  }

  valueOf(): UnixTimestampNumber {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  toLocalDate(): LocalDate {
    return localDate.fromDate(this.$date)
  }

  /**
   * Returns e.g: `1984-06-21 17:56:21`
   * or (if seconds=false):
   * `1984-06-21 17:56`
   */
  toPretty(seconds = true): IsoDateTimeString {
    return this.toISODate() + ' ' + this.toISOTime(seconds)
    // !! Not using toISOString(), as it returns time in UTC, not in local timezone (unexpected!)
    // const s = this.$date.toISOString()
    // return s.slice(0, 10) + ' ' + s.slice(11, seconds ? 19 : 16)
  }

  /**
   * Returns e.g: `1984-06-21T17:56:21`
   */
  toISODateTime(): IsoDateTimeString {
    return this.toISODate() + 'T' + this.toISOTime()
    // !! Not using toISOString(), as it returns time in UTC, not in local timezone (unexpected!)
    // return this.$date.toISOString().slice(0, 19)
  }

  /**
   * Returns e.g: `1984-06-21`, only the date part of DateTime
   */
  toISODate(): IsoDateString {
    const { year, month, day } = this.dateComponents()

    return [
      String(year).padStart(4, '0'),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join('-')

    // !! Not using toISOString(), as it returns time in UTC, not in local timezone (unexpected!)
    // return this.$date.toISOString().slice(0, 10)
  }

  /**
   * Returns e.g: `17:03:15` (or `17:03` with seconds=false)
   */
  toISOTime(seconds = true): string {
    const { hour, minute, second } = this.timeComponents()

    return [
      String(hour).padStart(2, '0'),
      String(minute).padStart(2, '0'),
      seconds && String(second).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':')

    // !! Not using toISOString(), as it returns time in UTC, not in local timezone (unexpected!)
    // return this.$date.toISOString().slice(11, seconds ? 19 : 16)
  }

  /**
   * Returns e.g: `19840621_1705`
   */
  toStringCompact(seconds = false): string {
    const { year, month, day, hour, minute, second } = this.components()

    return [
      String(year).padStart(4, '0'),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
      '_',
      String(hour).padStart(2, '0'),
      String(minute).padStart(2, '0'),
      seconds ? String(second).padStart(2, '0') : '',
    ].join('')
  }

  toString(): string {
    return this.toISODateTime()
  }

  toJSON(): UnixTimestampNumber {
    return this.unix()
  }

  toMonthId(): MonthId {
    return this.toISODate().slice(0, 7)
  }

  format(fmt: Intl.DateTimeFormat | LocalTimeFormatter): string {
    if (fmt instanceof Intl.DateTimeFormat) {
      return fmt.format(this.$date)
    }

    return fmt(this)
  }
}

class LocalTimeFactory {
  /**
   * Parses input String into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  of(d: LocalTimeInput): LocalTime {
    const t = this.parseOrNull(d)

    _assert(t !== null, `Cannot parse "${d}" into LocalTime`, {
      input: d,
    })

    return t
  }

  /**
   * Create LocalTime from unixTimestamp in milliseconds (not in seconds).
   */
  ofMillis(millis: UnixTimestampMillisNumber): LocalTime {
    return this.of(new Date(millis))
  }

  /**
   * Returns null if invalid
   */
  parseOrNull(d: LocalTimeInput | undefined | null): LocalTime | null {
    if (!d) return null
    if (d instanceof LocalTime) return d

    let date

    if (d instanceof Date) {
      date = d
    } else if (typeof d === 'number') {
      date = new Date(d * 1000)
    } else if (typeof (d as any) !== 'string') {
      // unexpected type, e.g Function or something
      return null
    } else {
      // Slicing removes the "timezone component", and makes the date "local"
      // e.g 2022-04-06T23:15:00+09:00
      // becomes 2022-04-06T23:15:00
      date = new Date(d.slice(0, 19))
      // We used to slice to remove the timezone information, now we don't
      // date = new Date(d)
    }

    // validation
    if (isNaN(date.getDate())) {
      // throw new TypeError(`Cannot parse "${d}" into LocalTime`)
      return null
    }

    return new LocalTime(date)
  }

  parseToDate(d: LocalTimeInput): Date {
    if (d instanceof LocalTime) return d.$date
    if (d instanceof Date) return d

    const date = typeof d === 'number' ? new Date(d * 1000) : new Date(d)

    _assert(!isNaN(date.getDate()), `Cannot parse "${d}" to Date`, {
      input: d,
    })

    return date
  }

  parseToUnixTimestamp(d: LocalTimeInput): UnixTimestampNumber {
    if (typeof d === 'number') return d
    if (d instanceof LocalTime) return d.unix()

    const date = d instanceof Date ? d : new Date(d)

    _assert(!isNaN(date.getDate()), `Cannot parse "${d}" to UnixTimestamp`, {
      input: d,
    })

    return date.valueOf() / 1000
  }

  isValid(d: LocalTimeInput | undefined | null): boolean {
    return this.parseOrNull(d) !== null
  }

  now(): LocalTime {
    return new LocalTime(new Date())
  }

  /**
   * Creates a LocalTime from the input, unless it's falsy - then returns undefined.
   *
   * `localTime` function will instead return LocalTime of `now` for falsy input.
   */
  orUndefined(d?: LocalTimeInput | null): LocalTime | undefined {
    return d ? this.of(d) : undefined
  }

  /**
   * Creates a LocalTime from the input, unless it's falsy - then returns LocalTime.now
   */
  orNow(d?: LocalTimeInput | null): LocalTime {
    return d ? this.of(d) : this.now()
  }

  fromComponents(c: { year: number; month: number } & Partial<LocalTimeComponents>): LocalTime {
    return new LocalTime(
      new Date(c.year, c.month - 1, c.day || 1, c.hour || 0, c.minute || 0, c.second || 0),
    )
  }

  sort(items: LocalTime[], dir: SortDirection = 'asc', mutate = false): LocalTime[] {
    const mod = dir === 'desc' ? -1 : 1
    return (mutate ? items : [...items]).sort((a, b) => {
      const v1 = a.$date.valueOf()
      const v2 = b.$date.valueOf()
      if (v1 === v2) return 0
      return (v1 < v2 ? -1 : 1) * mod
    })
  }

  minOrUndefined(items: LocalTimeInput[]): LocalTime | undefined {
    return items.length ? this.min(items) : undefined
  }

  min(items: LocalTimeInput[]): LocalTime {
    _assert(items.length, 'localTime.min called on empty array')

    return items
      .map(i => this.of(i))
      .reduce((min, item) => (min.$date.valueOf() <= item.$date.valueOf() ? min : item))
  }

  maxOrUndefined(items: LocalTimeInput[]): LocalTime | undefined {
    return items.length ? this.max(items) : undefined
  }

  max(items: LocalTimeInput[]): LocalTime {
    _assert(items.length, 'localTime.max called on empty array')

    return items
      .map(i => this.of(i))
      .reduce((max, item) => (max.$date.valueOf() >= item.$date.valueOf() ? max : item))
  }
}

// based on: https://github.com/date-fns/date-fns/blob/master/src/getISOWeek/index.ts
function getWeek(date: Date): number {
  const diff = startOfWeek(date).getTime() - startOfWeekYear(date).getTime()
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
}

function setWeek(date: Date, week: number, mutate = false): Date {
  const d = mutate ? date : new Date(date)
  const diff = getWeek(d) - week
  d.setDate(d.getDate() - diff * 7)
  return d
}

// based on: https://github.com/date-fns/date-fns/blob/master/src/startOfISOWeekYear/index.ts
function startOfWeekYear(date: Date): Date {
  const year = getWeekYear(date)
  const fourthOfJanuary = new Date(0)
  fourthOfJanuary.setFullYear(year, 0, 4)
  fourthOfJanuary.setHours(0, 0, 0, 0)
  return startOfWeek(fourthOfJanuary, true)
}

// based on: https://github.com/date-fns/date-fns/blob/fd6bb1a0bab143f2da068c05a9c562b9bee1357d/src/getISOWeekYear/index.ts
function getWeekYear(date: Date): number {
  const year = date.getFullYear()

  const fourthOfJanuaryOfNextYear = new Date(0)
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4)
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0)
  const startOfNextYear = startOfWeek(fourthOfJanuaryOfNextYear, true)

  const fourthOfJanuaryOfThisYear = new Date(0)
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4)
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0)
  const startOfThisYear = startOfWeek(fourthOfJanuaryOfThisYear, true)

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year
  }
  return year - 1
}

// based on: https://github.com/date-fns/date-fns/blob/fd6bb1a0bab143f2da068c05a9c562b9bee1357d/src/startOfWeek/index.ts
function startOfWeek(date: Date, mutate = false): Date {
  const d = mutate ? date : new Date(date)

  const day = d.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// based on: https://github.com/date-fns/date-fns/blob/master/src/endOfWeek/index.ts
function endOfWeek(date: Date, mutate = false): Date {
  const d = mutate ? date : new Date(date)

  const day = d.getDay()
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn)

  d.setDate(d.getDate() + diff)
  return d
}

function addMonths(d: Date, num: number, mutate = false): Date {
  if (!mutate) d = new Date(d)

  let day = d.getDate()
  let month = d.getMonth() + 1 + num

  if (day < 29) {
    d.setMonth(month - 1)
    return d
  }

  let year = d.getFullYear()

  while (month > 12) {
    year++
    month -= 12
  }
  while (month < 1) {
    year--
    month += 12
  }

  const monthLen = localDate.getMonthLength(year, month)
  if (day > monthLen) day = monthLen

  d.setFullYear(year, month - 1, day)
  return d
}

function differenceInMonths(a: Date, b: Date): number {
  if (a.getDate() < b.getDate()) return -differenceInMonths(b, a)
  const wholeMonthDiff = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  const anchor = addMonths(a, wholeMonthDiff).getTime()
  const sign = b.getTime() - anchor >= 0 ? 1 : -1
  const anchor2 = addMonths(a, wholeMonthDiff + sign).getTime()
  return -(wholeMonthDiff + ((b.getTime() - anchor) / (anchor2 - anchor)) * sign)
}

interface LocalTimeFn extends LocalTimeFactory {
  (d: LocalTimeInput): LocalTime
}

const localTimeFactory = new LocalTimeFactory()

export const localTime = localTimeFactory.of.bind(localTimeFactory) as LocalTimeFn

// The line below is the blackest of black magic I have ever written in 2024.
// And probably 2023 as well.
Object.setPrototypeOf(localTime, localTimeFactory)

/**
 Convenience function to return current Unix timestamp in seconds.
 Like Date.now(), but in seconds.
 */
export function nowUnix(): UnixTimestampNumber {
  return Math.floor(Date.now() / 1000)
}

/**
 * UTC offset is the opposite of "timezone offset" - it's the number of minutes to add
 * to the local time to get UTC time.
 *
 * E.g utcOffset for CEST is -120,
 * which means that you need to add -120 minutes to the local time to get UTC time.
 *
 * Instead of -0 it returns 0, for the peace of mind and less weird test/snapshot differences.
 */
export function getUTCOffsetMinutes(): NumberOfMinutes {
  return -new Date().getTimezoneOffset() || 0
}

/**
 * Same as getUTCOffsetMinutes, but rounded to hours.
 *
 * E.g for CEST it is -2.
 *
 * Instead of -0 it returns 0, for the peace of mind and less weird test/snapshot differences.
 */
export function getUTCOffsetHours(): NumberOfHours {
  return Math.round(getUTCOffsetMinutes() / 60)
}
