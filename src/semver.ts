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
  private constructor(public tokens: SemverTokens) {}

  get major(): number {
    return this.tokens[0]
  }
  get minor(): number {
    return this.tokens[1]
  }
  get patch(): number {
    return this.tokens[2]
  }

  static of(input: SemverInput): Semver {
    const s = this.parseOrNull(input)

    _assert(s !== null, `Cannot parse "${input}" into Semver`, {
      userFriendly: true,
      input,
    })

    return s
  }

  static parseOrNull(input: SemverInput | undefined | null): Semver | null {
    if (!input) return null
    if (input instanceof Semver) return input

    const t = input.split('.')
    return new Semver(_range(3).map(i => parseInt(t[i]!) || 0) as SemverTokens)
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
    const { tokens } = Semver.of(other)
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

/**
 * Shortcut for Semver.of(input)
 */
export function _semver(input: SemverInput): Semver {
  return Semver.of(input)
}
