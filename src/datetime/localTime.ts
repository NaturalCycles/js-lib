import { _assert } from '../error/assert'
import { _ms } from '../time/time.util'
import { IsoDateString, IsoDateTimeString, UnixTimestampNumber } from '../types'
import { Inclusiveness, LocalDate } from './localDate'

export type LocalTimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

export type LocalTimeConfig = LocalTime | Date | IsoDateTimeString | UnixTimestampNumber

export interface LocalTimeComponents {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/* eslint-disable no-dupe-class-members */

/**
 * @experimental
 */
export class LocalTime {
  private constructor(private $date: Date, public utcMode: boolean) {}

  /**
   * Parses input String into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  static of(d: LocalTimeConfig): LocalTime {
    const t = this.parseOrNull(d)

    if (t === null) {
      throw new TypeError(`Cannot parse "${d}" into LocalTime`)
    }

    return t
  }

  utc(): this {
    this.utcMode = true
    return this
  }

  local(): this {
    this.utcMode = false
    return this
  }

  /**
   * Returns null if invalid
   */
  static parseOrNull(d: LocalTimeConfig | undefined | null): LocalTime | null {
    if (!d) return null
    if (d instanceof LocalTime) return d

    let date

    if (d instanceof Date) {
      date = d
    } else if (typeof d === 'number') {
      date = new Date(d * 1000)
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

    return new LocalTime(date, false)
  }

  static parseToDate(d: LocalTimeConfig): Date {
    if (d instanceof LocalTime) return d.$date
    if (d instanceof Date) return d

    const date = typeof d === 'number' ? new Date(d * 1000) : new Date(d)

    if (isNaN(date.getDate())) {
      throw new TypeError(`Cannot parse "${d}" to Date`)
    }

    return date
  }

  static parseToUnixTimestamp(d: LocalTimeConfig): UnixTimestampNumber {
    if (typeof d === 'number') return d
    if (d instanceof LocalTime) return d.unix()

    const date = d instanceof Date ? d : new Date(d)

    if (isNaN(date.getDate())) {
      throw new TypeError(`Cannot parse "${d}" to UnixTimestamp`)
    }

    return date.valueOf() / 1000
  }

  static isValid(d: LocalTimeConfig | undefined | null): boolean {
    return this.parseOrNull(d) !== null
  }

  static now(): LocalTime {
    return new LocalTime(new Date(), false)
  }

  static fromComponents(
    c: { year: number; month: number } & Partial<LocalTimeComponents>,
  ): LocalTime {
    return new LocalTime(new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.second), false)
  }

  get(unit: LocalTimeUnit): number {
    if (unit === 'year') {
      return this.utcMode ? this.$date.getUTCFullYear() : this.$date.getFullYear()
    }
    if (unit === 'month') {
      return (this.utcMode ? this.$date.getUTCMonth() : this.$date.getMonth()) + 1
    }
    if (unit === 'day') {
      return this.utcMode ? this.$date.getUTCDate() : this.$date.getDate()
    }
    if (unit === 'hour') {
      return this.utcMode ? this.$date.getUTCHours() : this.$date.getHours()
    }
    if (unit === 'minute') {
      return this.utcMode ? this.$date.getUTCMinutes() : this.$date.getMinutes()
    }
    // second
    return this.utcMode ? this.$date.getUTCSeconds() : this.$date.getSeconds()
  }

  set(unit: LocalTimeUnit, v: number, mutate = false): LocalTime {
    const t = mutate ? this : this.clone()

    /* eslint-disable @typescript-eslint/no-unused-expressions */
    if (unit === 'year') {
      this.utcMode ? t.$date.setUTCFullYear(v) : t.$date.setFullYear(v)
    } else if (unit === 'month') {
      this.utcMode ? t.$date.setUTCMonth(v - 1) : t.$date.setMonth(v - 1)
    } else if (unit === 'day') {
      this.utcMode ? t.$date.setUTCDate(v) : t.$date.setDate(v)
    } else if (unit === 'hour') {
      this.utcMode ? t.$date.setUTCHours(v) : t.$date.setHours(v)
    } else if (unit === 'minute') {
      this.utcMode ? t.$date.setUTCMinutes(v) : t.$date.setMinutes(v)
    } else if (unit === 'second') {
      this.utcMode ? t.$date.setUTCSeconds(v) : t.$date.setSeconds(v)
    }
    /* eslint-enable @typescript-eslint/no-unused-expressions */

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
  day(): number
  day(v: number): LocalTime
  day(v?: number): number | LocalTime {
    return v === undefined ? this.get('day') : this.set('day', v)
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

    /* eslint-disable @typescript-eslint/no-unused-expressions */
    if (c.year) {
      this.utcMode ? d.setUTCFullYear(c.year) : d.setFullYear(c.year)
    }
    if (c.month) {
      this.utcMode ? d.setUTCMonth(c.month - 1) : d.setMonth(c.month - 1)
    }
    if (c.day) {
      this.utcMode ? d.setUTCDate(c.day) : d.setDate(c.day)
    }
    if (c.hour !== undefined) {
      this.utcMode ? d.setUTCHours(c.hour) : d.setHours(c.hour)
    }
    if (c.minute !== undefined) {
      this.utcMode ? d.setUTCMinutes(c.minute) : d.setMinutes(c.minute)
    }
    if (c.second !== undefined) {
      this.utcMode ? d.setUTCSeconds(c.second) : d.setSeconds(c.second)
    }
    /* eslint-enable @typescript-eslint/no-unused-expressions */

    return mutate ? this : new LocalTime(d, this.utcMode)
  }

  add(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    return this.set(unit, this.get(unit) + num, mutate)
  }

  subtract(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    return this.add(num * -1, unit, mutate)
  }

  absDiff(other: LocalTimeConfig, unit: LocalTimeUnit): number {
    return Math.abs(this.diff(other, unit))
  }

  diff(other: LocalTimeConfig, unit: LocalTimeUnit): number {
    const date2 = LocalTime.parseToDate(other)

    if (unit === 'year') {
      return this.$date.getFullYear() - date2.getFullYear()
    }
    if (unit === 'month') {
      return (
        (this.$date.getFullYear() - date2.getFullYear()) * 12 +
        this.$date.getMonth() -
        date2.getMonth()
      )
    }

    const secDiff = (this.$date.valueOf() - date2.valueOf()) / 1000
    let r

    if (unit === 'day') {
      r = secDiff / (24 * 60 * 60)
    } else if (unit === 'hour') {
      r = secDiff / (60 * 60)
    } else if (unit === 'minute') {
      r = secDiff / 60
    } else {
      // unit === 'second'
      r = secDiff
    }

    r = r < 0 ? -Math.floor(-r) : Math.floor(r)
    if (Object.is(r, -0)) return 0
    return r
  }

  startOf(unit: LocalTimeUnit, mutate = false): LocalTime {
    if (unit === 'second') return this

    const d = mutate ? this.$date : new Date(this.$date)
    d.setMilliseconds(0)
    d.setSeconds(0)

    /* eslint-disable @typescript-eslint/no-unused-expressions */
    if (unit !== 'minute') {
      this.utcMode ? d.setUTCMinutes(0) : d.setMinutes(0)
      if (unit !== 'hour') {
        this.utcMode ? d.setUTCHours(0) : d.setHours(0)
        if (unit !== 'day') {
          this.utcMode ? d.setUTCDate(0) : d.setDate(0)
          if (unit !== 'month') {
            this.utcMode ? d.setUTCMonth(0) : d.setMonth(0)
          }
        }
      }
    }
    /* eslint-enable @typescript-eslint/no-unused-expressions */

    return mutate ? this : new LocalTime(d, this.utcMode)
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

  static earliestOrUndefined(items: LocalTime[]): LocalTime | undefined {
    return items.length ? LocalTime.earliest(items) : undefined
  }

  static earliest(items: LocalTime[]): LocalTime {
    _assert(items.length, 'LocalTime.earliest called on empty array')

    return items.reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }

  static latestOrUndefined(items: LocalTime[]): LocalTime | undefined {
    return items.length ? LocalTime.latest(items) : undefined
  }

  static latest(items: LocalTime[]): LocalTime {
    _assert(items.length, 'LocalTime.latest called on empty array')

    return items.reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
  }

  isSame(d: LocalTimeConfig): boolean {
    return this.cmp(d) === 0
  }

  isBefore(d: LocalTimeConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === -1 || (r === 0 && inclusive)
  }

  isSameOrBefore(d: LocalTimeConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: LocalTimeConfig, inclusive = false): boolean {
    const r = this.cmp(d)
    return r === 1 || (r === 0 && inclusive)
  }

  isSameOrAfter(d: LocalTimeConfig): boolean {
    return this.cmp(d) >= 0
  }

  isBetween(min: LocalTimeConfig, max: LocalTimeConfig, incl: Inclusiveness = '[)'): boolean {
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
  cmp(d: LocalTimeConfig): -1 | 0 | 1 {
    const t1 = this.$date.valueOf()
    const t2 = LocalTime.parseToDate(d).valueOf()
    if (t1 === t2) return 0
    return t1 < t2 ? -1 : 1
  }

  // todo: endOf

  components(): LocalTimeComponents {
    if (this.utcMode) {
      return {
        year: this.$date.getUTCFullYear(),
        month: this.$date.getUTCMonth() + 1,
        day: this.$date.getUTCDate(),
        hour: this.$date.getUTCHours(),
        minute: this.$date.getUTCMinutes(),
        second: this.$date.getSeconds(),
      }
    }

    return {
      year: this.$date.getFullYear(),
      month: this.$date.getMonth() + 1,
      day: this.$date.getDate(),
      hour: this.$date.getHours(),
      minute: this.$date.getMinutes(),
      second: this.$date.getSeconds(),
    }
  }

  fromNow(now: LocalTimeConfig = new Date()): string {
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
    return new LocalTime(new Date(this.$date), this.utcMode)
  }

  unix(): UnixTimestampNumber {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  unixMillis(): number {
    return this.$date.valueOf()
  }

  valueOf(): UnixTimestampNumber {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  toLocalDate(): LocalDate {
    if (this.utcMode) {
      return LocalDate.create(
        this.$date.getUTCFullYear(),
        this.$date.getUTCMonth() + 1,
        this.$date.getUTCDate(),
      )
    }

    return LocalDate.create(
      this.$date.getFullYear(),
      this.$date.getMonth() + 1,
      this.$date.getDate(),
    )
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
    return String(this.unix())
  }

  toJSON(): UnixTimestampNumber {
    return this.unix()
  }
}

/**
 * Shortcut wrapper around `LocalDate.parse` / `LocalDate.today`
 */
export function localTime(d?: LocalTimeConfig): LocalTime {
  return d ? LocalTime.of(d) : LocalTime.now()
}
