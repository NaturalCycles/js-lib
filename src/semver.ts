import { _range } from './array/range'
import { _assert } from './error/assert'

export type SemverInput = string | Semver
export type SemverTokens = [major: number, minor: number, patch: number]

/**
 * Simple Semver implementation.
 *
 * Suitable for Browser usage, unlike npm `semver` which is Node-targeted and simply too big for the Browser.
 *
 * Parsing algorithm is simple:
 * 1. Split by `.`
 * 2. parseInt each of 3 tokens, set to 0 if falsy
 *
 * toString returns `major.minor.patch`
 * Missing tokens are replaced with 0.
 *
 * _semver('1').toString() === '1.0.0'
 *
 * @experimental
 */
export class Semver {
  constructor(public tokens: SemverTokens) {}

  get major(): number {
    return this.tokens[0]
  }
  get minor(): number {
    return this.tokens[1]
  }
  get patch(): number {
    return this.tokens[2]
  }

  isAfter = (other: SemverInput): boolean => this.cmp(other) > 0
  isSameOrAfter = (other: SemverInput): boolean => this.cmp(other) >= 0
  isBefore = (other: SemverInput): boolean => this.cmp(other) < 0
  isSameOrBefore = (other: SemverInput): boolean => this.cmp(other) <= 0
  isSame = (other: SemverInput): boolean => this.cmp(other) === 0

  /**
   * Returns 1 if this > other
   * returns 0 if they are equal
   * returns -1 if this < other
   */
  cmp(other: SemverInput): -1 | 0 | 1 {
    const { tokens } = semver2.of(other)
    for (let i = 0; i < 3; i++) {
      if (this.tokens[i]! < tokens[i]!) return -1
      if (this.tokens[i]! > tokens[i]!) return 1
    }
    return 0
  }

  toJSON = (): string => this.toString()

  toString(): string {
    return this.tokens.join('.')
  }
}

class SemverFactory {
  of(input: SemverInput): Semver {
    const s = this.parseOrNull(input)

    _assert(s !== null, `Cannot parse "${input}" into Semver`, {
      userFriendly: true,
      input,
    })

    return s
  }

  parseOrNull(input: SemverInput | undefined | null): Semver | null {
    if (!input) return null
    if (input instanceof Semver) return input

    const t = input.split('.')
    return new Semver(_range(3).map(i => parseInt(t[i]!) || 0) as SemverTokens)
  }

  /**
   * Returns the highest (max) Semver from the array, or undefined if the array is empty.
   */
  maxOrUndefined(items: SemverInput[]): Semver | undefined {
    return items.length ? this.max(items) : undefined
  }

  /**
   * Returns the highest Semver from the array.
   * Throws if the array is empty.
   */
  max(items: SemverInput[]): Semver {
    _assert(items.length, 'semver.max called on empty array')
    return items.map(i => this.of(i)).reduce((max, item) => (max.isSameOrAfter(item) ? max : item))
  }

  /**
   * Returns the lowest (min) Semver from the array, or undefined if the array is empty.
   */
  minOrUndefined(items: SemverInput[]): Semver | undefined {
    return items.length ? this.min(items) : undefined
  }

  /**
   * Returns the lowest Semver from the array.
   * Throws if the array is empty.
   */
  min(items: SemverInput[]): Semver {
    _assert(items.length, 'semver.min called on empty array')
    return items.map(i => this.of(i)).reduce((min, item) => (min.isSameOrBefore(item) ? min : item))
  }
}

interface SemverFn extends SemverFactory {
  (input: SemverInput): Semver
}

const semverFactory = new SemverFactory()

export const semver2 = semverFactory.of.bind(semverFactory) as SemverFn

// The line below is the blackest of black magic I have ever written in 2024.
// And probably 2023 as well.
Object.setPrototypeOf(semver2, semverFactory)

/**
 * Returns 1 if a > b
 * returns 0 if they are equal
 * returns -1 if a < b
 *
 * Quick&dirty implementation, which should suffice for 95% of the cases.
 *
 * Credit: https://stackoverflow.com/a/47159772/4919972
 */
export function _quickSemverCompare(a: string, b: string): -1 | 0 | 1 {
  const t1 = a.split('.')
  const t2 = b.split('.')
  const s1 = _range(3)
    .map(i => (t1[i] || '').padStart(5))
    .join('')
  const s2 = _range(3)
    .map(i => (t2[i] || '').padStart(5))
    .join('')
  return s1 < s2 ? -1 : s1 > s2 ? 1 : 0
}
