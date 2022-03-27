import { _assert } from '../error/assert'
import { IsoDateTime, UnixTimestamp } from '../types'

export type LocalTimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

export type LocalTimeConfig = LocalTime | Date | IsoDateTime | UnixTimestamp

export interface LocalTimeComponents {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

/* eslint-disable no-dupe-class-members */

// Design choices:
// No milliseconds
// No timezone support, ISO8601 is parsed as LocalDateTime, discarding Timezone information
// Formats as unix timestamp, ISO8601 or "pretty string"
// toString and .toJSON formats as unix timestamp
// No "unixMillis", just pure unixtimestamp
// .valueOf returns unix timestamp (no millis)
// Prevents dayjs(undefined) being dayjs.now()
// Validates on parse, throws if invalid. Doesn't allow invalid objects
/**
 * @experimental
 */
export class LocalTime {
  private constructor(private $date: Date) {}

  /**
   * Parses input String into LocalDate.
   * Input can already be a LocalDate - it is returned as-is in that case.
   */
  static of(d: LocalTimeConfig): LocalTime {
    if (d instanceof LocalTime) return d
    if (d instanceof Date) return new LocalTime(d)

    if (typeof d === 'number') {
      // unix timestamp
      return new LocalTime(new Date(d * 1000))
    }

    const date = new Date(d)

    // validation
    if (isNaN(date.getDate())) {
      throw new TypeError(`Cannot parse "${d}" into LocalTime`)
    }

    return new LocalTime(date)
  }

  static unix(ts: UnixTimestamp): LocalTime {
    return new LocalTime(new Date(ts * 1000))
  }

  static now(): LocalTime {
    return this.of(new Date())
  }

  static fromComponents(
    c: { year: number; month: number } & Partial<LocalTimeComponents>,
  ): LocalTime {
    return new LocalTime(new Date(c.year, c.month - 1, c.day, c.hour, c.minute, c.second))
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
    }

    return t
  }

  year(): number
  year(v: number): LocalTime
  year(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getFullYear() : this.set('year', v)
  }
  month(): number
  month(v: number): LocalTime
  month(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getMonth() + 1 : this.set('month', v)
  }
  date(): number
  date(v: number): LocalTime
  date(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getDate() : this.set('day', v)
  }
  hour(): number
  hour(v: number): LocalTime
  hour(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getHours() : this.set('hour', v)
  }
  minute(): number
  minute(v: number): LocalTime
  minute(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getMinutes() : this.set('minute', v)
  }
  second(): number
  second(v: number): LocalTime
  second(v?: number): number | LocalTime {
    return v === undefined ? this.$date.getSeconds() : this.set('second', v)
  }

  setComponents(c: Partial<LocalTimeComponents>, mutate = false): LocalTime {
    const d = mutate ? this.$date : new Date(this.$date)

    if (c.year) {
      d.setFullYear(c.year)
    }
    if (c.month) {
      d.setMonth(c.month - 1)
    }
    if (c.day) {
      d.setDate(c.day)
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
    return this.set(unit, this.get(unit) + num, mutate)
  }

  subtract(num: number, unit: LocalTimeUnit, mutate = false): LocalTime {
    return this.add(-num, unit, mutate)
  }

  absDiff(other: LocalTimeConfig, unit: LocalTimeUnit): number {
    return Math.abs(this.diff(other, unit))
  }

  diff(other: LocalTimeConfig, unit: LocalTimeUnit): number {
    const date2 = LocalTime.of(other).$date

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

    if (mutate) {
      const d = this.$date
      d.setSeconds(0)
      if (unit === 'minute') return this
      d.setMinutes(0)
      if (unit === 'hour') return this
      d.setHours(0)
      if (unit === 'day') return this
      d.setDate(0)
      if (unit === 'month') return this
      d.setMonth(0)
      return this
    }

    const c = this.components()

    c.second = 0
    if (unit === 'year') {
      c.month = c.day = 1
      c.hour = c.minute = 0
    } else if (unit === 'month') {
      c.day = 1
      c.hour = c.minute = 0
    } else if (unit === 'day') {
      c.hour = c.minute = 0
    } else if (unit === 'hour') {
      c.minute = 0
    }

    return LocalTime.fromComponents(c)
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

  isBefore(d: LocalTimeConfig): boolean {
    return this.cmp(d) === -1
  }

  isSameOrBefore(d: LocalTimeConfig): boolean {
    return this.cmp(d) <= 0
  }

  isAfter(d: LocalTimeConfig): boolean {
    return this.cmp(d) === 1
  }

  isSameOrAfter(d: LocalTimeConfig): boolean {
    return this.cmp(d) >= 0
  }

  /**
   * Returns 1 if this > d
   * returns 0 if they are equal
   * returns -1 if this < d
   */
  cmp(d: LocalTimeConfig): -1 | 0 | 1 {
    const t1 = this.$date.valueOf()
    const t2 = LocalTime.of(d).$date.valueOf()
    if (t1 === t2) return 0
    return t1 < t2 ? -1 : 1
  }

  // todo: endOf

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

  getDate(): Date {
    return this.$date
  }

  clone(): LocalTime {
    return new LocalTime(new Date(this.$date))
  }

  unix(): UnixTimestamp {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  valueOf(): UnixTimestamp {
    return Math.floor(this.$date.valueOf() / 1000)
  }

  toISO8601(): IsoDateTime {
    return this.$date.toISOString().slice(0, 19)
  }

  toPretty(): IsoDateTime {
    return this.$date.toISOString().slice(0, 19).split('T').join(' ')
  }

  /**
   * Returns e.g: `19840621_1705`
   */
  toStringCompact(seconds = false): string {
    return [
      String(this.$date.getFullYear()).padStart(4, '0'),
      String(this.$date.getMonth() + 1).padStart(2, '0'),
      String(this.$date.getDate()).padStart(2, '0'),
      '_',
      String(this.$date.getHours()).padStart(2, '0'),
      String(this.$date.getMinutes()).padStart(2, '0'),
      seconds ? String(this.$date.getSeconds()).padStart(2, '0') : '',
    ].join('')
  }

  toString(): string {
    return String(this.unix())
  }

  toJSON(): UnixTimestamp {
    return this.unix()
  }
}

/**
 * Shortcut wrapper around `LocalDate.parse` / `LocalDate.today`
 */
export function localTime(d?: LocalTimeConfig): LocalTime {
  return d ? LocalTime.of(d) : LocalTime.now()
}

// todo: range
