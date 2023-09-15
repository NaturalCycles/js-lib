import { _assert } from '../error/assert'
import { _ms } from '../time/time.util'
import type {
  IsoDateString,
  IsoDateTimeString,
  MonthId,
  UnixTimestampMillisNumber,
  UnixTimestampNumber,
} from '../types'
import type { Inclusiveness } from './localDate'
import { LocalDate } from './localDate'

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

export interface LocalTimeComponents {
  year: number
  month: number
  day: number
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

/**
 * @experimental
 */
export class LocalTime {
  private constructor(private $date: Date) {}

  /**
   * Parses input String into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  static of(d: LocalTimeInput): LocalTime {
    const t = this.parseOrNull(d)

    _assert(t !== null, `Cannot parse "${d}" into LocalTime`, {
      input: d,
    })

    return t
  }

  /**
   * Create LocalTime from unixTimestamp in milliseconds (not in seconds).
   */
  static ofMillis(millis: UnixTimestampMillisNumber): LocalTime {
    return LocalTime.of(new Date(millis))
  }

  /**
   * Returns null if invalid
   */
  static parseOrNull(d: LocalTimeInput | undefined | null): LocalTime | null {
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
      date = new Date(d.slice(0, 19))
    }

    // validation
    if (isNaN(date.getDate())) {
      // throw new TypeError(`Cannot parse "${d}" into LocalTime`)
      return null
    }

    // if (utc) {
    //   date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    // }

    return new LocalTime(date)
  }

  static parseToDate(d: LocalTimeInput): Date {
    if (d instanceof LocalTime) return d.$date
    if (d instanceof Date) return d

    const date = typeof d === 'number' ? new Date(d * 1000) : new Date(d)

    _assert(!isNaN(date.getDate()), `Cannot parse "${d}" to Date`, {
      input: d,
    })

    return date
  }

  static parseToUnixTimestamp(d: LocalTimeInput): UnixTimestampNumber {
    if (typeof d === 'number') return d
    if (d instanceof LocalTime) return d.unix()

    const date = d instanceof Date ? d : new Date(d)

    _assert(!isNaN(date.getDate()), `Cannot parse "${d}" to UnixTimestamp`, {
      input: d,
    })

    return date.valueOf() / 1000
  }

  static isValid(d: LocalTimeInput | undefined | null): boolean {
    return this.parseOrNull(d) !== null
  }

  static now(): LocalTime {
    return new LocalTime(new Date())
  }

  static fromComponents(
    c: { year: number; month: number } & Partial<LocalTimeComponents>,
  ): LocalTime {
    return new LocalTime(
      new Date(c.year, c.month - 1, c.day || 1, c.hour || 0, c.minute || 0, c.second || 0),
    )
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

    return this.add(v - dow, 'day')
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

  add(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    if (unit === 'week') {
      num *= 7
      unit = 'day'
    }

    if (unit === 'year' || unit === 'month') {
      const d = addMonths(this.$date, unit === 'month' ? num : num * 12, mutate)
      return mutate ? this : LocalTime.of(d)
    }

    return this.set(unit, this.get(unit) + num, mutate)
  }

  subtract(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    return this.add(num * -1, unit, mutate)
  }

  absDiff(other: LocalTimeInput, unit: LocalTimeUnit): number {
    return Math.abs(this.diff(other, unit))
  }

  diff(other: LocalTimeInput, unit: LocalTimeUnit): number {
    const date2 = LocalTime.parseToDate(other)

    const secDiff = (this.$date.valueOf() - date2.valueOf()) / 1000
    if (!secDiff) return 0

    let r

    if (unit === 'year') {
      r = differenceInMonths(this.getDate(), date2) / 12
    } else if (unit === 'month') {
      r = differenceInMonths(this.getDate(), date2)
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
            const lastDay = LocalDate.getMonthLength(d.getFullYear(), d.getMonth() + 1)
            d.setDate(lastDay)
          }
        }
      }
    }

    return mutate ? this : new LocalTime(d)
  }

  static sort(items: LocalTime[], mutate = false, descending = false): LocalTime[] {
    const mod = descending ? -1 : 1
    return (mutate ? items : [...items]).sort((a, b) => {
      const v1 = a.$date.valueOf()
      const v2 = b.$date.valueOf()
      if (v1 === v2) return 0
      return (v1 < v2 ? -1 : 1) * mod
    })
  }

  static earliestOrUndefined(items: LocalTimeInput[]): LocalTime | undefined {
    return items.length ? LocalTime.earliest(items) : undefined
  }

  static earliest(items: LocalTimeInput[]): LocalTime {
    _assert(items.length, 'LocalTime.earliest called on empty array')

    return items
      .map(i => LocalTime.of(i))
      .reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }

  static latestOrUndefined(items: LocalTimeInput[]): LocalTime | undefined {
    return items.length ? LocalTime.latest(items) : undefined
  }

  static latest(items: LocalTimeInput[]): LocalTime {
    _assert(items.length, 'LocalTime.latest called on empty array')

    return items
      .map(i => LocalTime.of(i))
      .reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
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
   * Checks if this localTime is older than "now" by X units.
   *
   * Example:
   *
   * localTime(expirationDate).isOlderThan(5, 'day')
   *
   * Third argument allows to override "now".
   */
  isOlderThan(n: number, unit: LocalTimeUnit, now?: LocalTimeInput): boolean {
    return this.isBefore(LocalTime.of(now ?? new Date()).add(-n, unit))
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalTimeInput): -1 | 0 | 1 {
    const t1 = this.$date.valueOf()
    const t2 = LocalTime.parseToDate(d).valueOf()
    if (t1 === t2) return 0
    return t1 < t2 ? -1 : 1
  }

  components(): LocalTimeComponents {
    return {
      year: this.$date.getFullYear(),
      month: this.$date.getMonth() + 1,
      day: this.$date.getDate(),
      hour: this.$date.getHours(),
      minute: this.$date.getMinutes(),
      second: this.$date.getSeconds(),
    }
  }

  fromNow(now: LocalTimeInput = new Date()): string {
    const msDiff = LocalTime.parseToDate(now).valueOf() - this.$date.valueOf()

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
    return LocalDate.fromDate(this.$date)
  }

  toPretty(seconds = true): IsoDateTimeString {
    const { year, month, day, hour, minute, second } = this.components()

    return (
      [
        String(year).padStart(4, '0'),
        String(month).padStart(2, '0'),
        String(day).padStart(2, '0'),
      ].join('-') +
      ' ' +
      [
        String(hour).padStart(2, '0'),
        String(minute).padStart(2, '0'),
        seconds && String(second).padStart(2, '0'),
      ]
        .filter(Boolean)
        .join(':')
    )

    // return this.$date
    //   .toISOString()
    //   .slice(0, seconds ? 19 : 16)
    //   .split('T')
    //   .join(' ')
  }

  /**
   * Returns e.g: `1984-06-21T17:56:21`
   */
  toISODateTime(): IsoDateTimeString {
    return this.$date.toISOString().slice(0, 19)
  }

  /**
   * Returns e.g: `1984-06-21`, only the date part of DateTime
   */
  toISODate(): IsoDateString {
    const { year, month, day } = this.components()

    return [
      String(year).padStart(4, '0'),
      String(month).padStart(2, '0'),
      String(day).padStart(2, '0'),
    ].join('-')

    // return this.$date.toISOString().slice(0, 10)
  }

  /**
   * Returns e.g: `17:03:15` (or `17:03` with seconds=false)
   */
  toISOTime(seconds = true): string {
    // return this.$date.toISOString().slice(11, seconds ? 19 : 16)
    const { hour, minute, second } = this.components()

    return [
      String(hour).padStart(2, '0'),
      String(minute).padStart(2, '0'),
      seconds && String(second).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':')
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
    return this.$date.toISOString().slice(0, 7)
  }

  format(fmt: Intl.DateTimeFormat | LocalTimeFormatter): string {
    if (fmt instanceof Intl.DateTimeFormat) {
      return fmt.format(this.$date)
    }

    return fmt(this)
  }
}

/**
 * Shortcut wrapper around `LocalTime.of`
 */
export function localTime(d: LocalTimeInput): LocalTime {
  return LocalTime.of(d)
}

/**
 * Shortcut wrapper around `LocalTime.now`
 */
export function localTimeNow(): LocalTime {
  return LocalTime.now()
}

/**
 * Creates a LocalTime from the input, unless it's falsy - then returns undefined.
 *
 * `localTime` function will instead return LocalTime of `now` for falsy input.
 */
export function localTimeOrUndefined(d?: LocalTimeInput | null): LocalTime | undefined {
  return d ? LocalTime.of(d) : undefined
}

/**
 * Creates a LocalTime from the input, unless it's falsy - then returns LocalTime.now
 */
export function localTimeOrNow(d?: LocalTimeInput | null): LocalTime {
  return d ? LocalTime.of(d) : LocalTime.now()
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

  const monthLen = LocalDate.getMonthLength(year, month)
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
