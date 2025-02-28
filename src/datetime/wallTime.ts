import { IsoDate } from '../types'
import { DateTimeObject } from './localTime'

/**
 * Representation of a "time on the wall clock",
 * which means "local time, regardless of timezone".
 *
 * Experimental simplified container object to hold
 * date and time components as numbers.
 * No math or manipulation is possible here.
 * Can be pretty-printed as Date, Time or DateAndTime.
 */
export class WallTime implements DateTimeObject {
  year!: number
  month!: number
  day!: number
  hour!: number
  minute!: number
  second!: number

  constructor(obj: DateTimeObject) {
    Object.assign(this, obj)
  }

  /**
   * Returns e.g: `1984-06-21 17:56:21`
   * or (if seconds=false):
   * `1984-06-21 17:56`
   */
  toPretty(seconds = true): string {
    return this.toISODate() + ' ' + this.toISOTime(seconds)
  }

  /**
   * Returns e.g: `1984-06-21`, only the date part of DateTime
   */
  toISODate(): IsoDate {
    return [
      String(this.year).padStart(4, '0'),
      String(this.month).padStart(2, '0'),
      String(this.day).padStart(2, '0'),
    ].join('-') as IsoDate
  }

  /**
   * Returns e.g: `17:03:15` (or `17:03` with seconds=false)
   */
  toISOTime(seconds = true): string {
    return [
      String(this.hour).padStart(2, '0'),
      String(this.minute).padStart(2, '0'),
      seconds && String(this.second).padStart(2, '0'),
    ]
      .filter(Boolean)
      .join(':')
  }
}
