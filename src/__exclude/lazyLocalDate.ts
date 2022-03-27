import { LocalDateUnit, LocalDate, LocalDateConfig } from '../datetime/localDate'

export class LazyLocalDate {
  constructor(private str: string) {}

  private ld?: LocalDate

  eq(d: LocalDateConfig): boolean {
    if (typeof d === 'string') return d === this.str
    this.ld ||= LocalDate.of(this.str)
    return this.ld.isSame(d)
  }

  lt(d: LocalDateConfig): boolean {
    return this.cmp(d) === -1
  }

  lte(d: LocalDateConfig): boolean {
    return this.cmp(d) <= 0
  }

  gt(d: LocalDateConfig): boolean {
    return this.cmp(d) === 1
  }

  gte(d: LocalDateConfig): boolean {
    return this.cmp(d) >= 0
  }

  cmp(d: LocalDateConfig): -1 | 0 | 1 {
    if (typeof d === 'string') {
      return this.str < d ? -1 : this.str > d ? 1 : 0
    }

    this.ld ||= LocalDate.of(this.str)
    return this.ld.cmp(d)
  }

  absDiff(d: LocalDateConfig, unit: LocalDateUnit): number {
    return Math.abs(this.diff(d, unit))
  }

  diff(d: LocalDateConfig, unit: LocalDateUnit): number {
    this.ld ||= LocalDate.of(this.str)
    return this.ld.diff(d, unit)
  }

  add(num: number, unit: LocalDateUnit): LocalDate {
    this.ld ||= LocalDate.of(this.str)
    return this.ld.add(num, unit)
  }

  subtract(num: number, unit: LocalDateUnit): LocalDate {
    return this.add(-num, unit)
  }

  clone(): LazyLocalDate {
    return new LazyLocalDate(this.str)
  }

  toDate(): Date {
    this.ld ||= LocalDate.of(this.str)
    return this.ld.toDate()
  }

  toString(): string {
    return this.str
  }

  toJSON(): string {
    return this.str
  }
}
