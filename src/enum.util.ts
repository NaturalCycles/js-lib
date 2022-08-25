import type { NumberEnum, StringEnum } from './types'

/**
 * Returns all number keys of a number-enum.
 */
export function _numberEnumKeys(en: NumberEnum): string[] {
  return Object.values(en).filter(k => typeof k === 'string') as string[]
}

/**
 * Returns all number values of a number-enum.
 */
export function _numberEnumValues(en: NumberEnum): number[] {
  return Object.values(en).filter(k => typeof k === 'number') as number[]
}

/**
 * Returns all string keys of a string-enum.
 */
export function _stringEnumKeys(en: StringEnum): string[] {
  return Object.keys(en)
}

/**
 * Returns all string values of a string-enum.
 */
export function _stringEnumValues(en: StringEnum): string[] {
  // filtering here is unnecessary, but works as a safety in case Number-enum is passed
  return Object.values(en).filter(k => typeof k === 'string')
}

/**
 * Returns all number-enum "entries", where entry is a tuple of [key, value],
 * where key is a String key, value is a Number value, typed as Enum itself.
 *
 * Doesn't work on String-enums!
 */
export function _numberEnumEntries<T extends NumberEnum>(en: T): [k: string, v: T[keyof T]][] {
  return Object.values(en)
    .filter(k => typeof k === 'string')
    .map(k => [k, en[k]]) as any
}

/**
 * Returns all string-enum "entries", where entry is a tuple of [key, value],
 * where key is a String key, value is a String value, typed as Enum itself.
 *
 * Doesn't work on Number-enums!
 */
export function _stringEnumEntries<T extends StringEnum>(en: T): [k: string, v: T[keyof T]][] {
  return Object.keys(en).map(k => [k, en[k]]) as any
}

/**
 * Allows to return a Number enum value (typed as Enum itself) based on it's String key.
 * e.g:
 * const v = SomeEnum['stringValue']
 * // v is of type SomeEnum, which is of type Number
 *
 * Throws if value is not found!
 */
export function _numberEnumInverse<T extends NumberEnum>(en: T, v: string): T[keyof T] {
  const r = en[v as keyof T] as any
  if (!r) throw new Error(`enumInverse value not found for: ${v}`)
  return r
}

/**
 * _enumInverse, but allows to get/return undefined output.
 */
export function _numberEnumInverseNullable<T extends NumberEnum>(
  en: T,
  v: string | undefined,
): T[keyof T] | undefined {
  return en[v as keyof T]
}

/**
 * Takes number or string enum input, returns normalized Enum output.
 * Only works for number enums.
 *
 * Throws if value is not found!
 */
export function _numberEnumNormalize<T extends NumberEnum>(en: T, v: string | number): T[keyof T] {
  const r = _numberEnumNormalizeNullable(en, v)
  if (!r || !en[r as keyof T]) throw new Error(`enumNormalize value not found for: ${v}`)
  return r
}

/**
 * Same as _enumNormalize, but allows to return undefined values.
 */
export function _numberEnumNormalizeNullable<T extends NumberEnum>(
  en: T,
  v: string | number | undefined,
): T[keyof T] | undefined {
  return typeof v === 'string' ? en[v as keyof T] : (v as any)
}
