import type { Promisable } from './typeFest'

/**
 * Map from String to String (or <T>).
 *
 * Alternative: Record<string, T | undefined>
 */
export interface StringMap<T = string> {
  [k: string | number]: T | undefined
}

/**
 * Convenience shorthand for `Record<string, any>`.
 * Because `object` type is not safe/recommended to be used (e.g discouraged by eslint-typescript due to: https://github.com/microsoft/TypeScript/issues/21732)
 */
export type AnyObject = Record<string, any>

export type AnyEnum = NumberEnum
export type NumberEnum = Record<string, number | string>
export type StringEnum = Record<string, string>

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CreatedUpdated = {
  created: number
  updated: number
}

export interface CreatedUpdatedId extends CreatedUpdated {
  id: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ObjectWithId = {
  id: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type PartialObjectWithId = {
  id?: string
}

export interface AnyPartialObjectWithId extends AnyObject, PartialObjectWithId {}

export interface AnyObjectWithId extends AnyObject, ObjectWithId {}

/**
 * Base interface for any Entity that was saved to DB.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseDBEntity = {
  id: string

  /**
   * unixTimestamp of when the entity was first created (in the DB).
   */
  created: UnixTimestampNumber

  /**
   * unixTimestamp of when the entity was last updated (in the DB).
   */
  updated: UnixTimestampNumber
}

export type Saved<T> = T & {
  id: string
  created: UnixTimestampNumber
  updated: UnixTimestampNumber
}

export type SavedId<T> = T & {
  id: string
}

export type Unsaved<T> = Omit<T, 'id' | 'created' | 'updated'> & {
  id?: string
  created?: UnixTimestampNumber
  updated?: UnixTimestampNumber
}

export type UnsavedId<T> = Omit<T, 'id'> & {
  id?: string
}

/**
 * Convenience type shorthand.
 * Because `Function` type is discouraged by eslint.
 */
export type AnyFunction<T = any> = (...args: any[]) => T
export type AnyAsyncFunction<T = any> = (...args: any[]) => Promise<T>
export type AsyncFunction<T = any> = () => Promise<T>
export type AnyPromisableFunction<T = any> = (...args: any[]) => Promisable<T>
export type PromisableFunction<T = any> = () => Promisable<T>

/**
 * Symbol to indicate END of Sequence.
 */
export const END = Symbol('END')

/**
 * Symbol to indicate SKIP of item (e.g in AbortableMapper)
 */
export const SKIP = Symbol('SKIP')

/**
 * Symbol to indicate cache miss.
 * To distinguish from cache returning `undefined` or `null`.
 */
export const MISS = Symbol('MISS')

/**
 * Function which is called for every item in `input`. Expected to return a `Promise` or value.
 */
export type AsyncMapper<IN = any, OUT = any> = (input: IN, index: number) => OUT | PromiseLike<OUT>
export type Mapper<IN = any, OUT = any> = (input: IN, index: number) => OUT

export const _passthroughMapper: Mapper = item => item
export const _passUndefinedMapper: Mapper<any, void> = () => undefined

/**
 * Function that does nothings and returns `undefined`.
 */
export const _noop = (..._args: any[]): undefined => undefined

export type Predicate<T> = (item: T, index: number) => boolean
export type AsyncPredicate<T> = (item: T, index: number) => boolean | PromiseLike<boolean>

export type AbortablePredicate<T> = (item: T, i: number) => boolean | typeof END
export type AbortableAsyncPredicate<T> = (item: T, i: number) => Promisable<boolean | typeof END>
export type AbortableMapper<IN = any, OUT = any> = (
  input: IN,
  i: number,
) => OUT | typeof SKIP | typeof END
export type AbortableAsyncMapper<IN = any, OUT = any> = (
  input: IN,
  i: number,
) => Promisable<OUT | typeof SKIP | typeof END>

export const _passthroughPredicate: Predicate<any> = () => true
export const _passNothingPredicate: Predicate<any> = () => false

export interface BatchResult<RES = any, ERR = Error> {
  /**
   * Array of successful executions.
   */
  results: RES[]

  /**
   * Returns empty array in case of 0 errors.
   */
  errors: ERR[]
}

/**
 * Like `keyof`, but for arrays.
 *
 * Based on: https://github.com/Microsoft/TypeScript/issues/20965#issuecomment-354858633
 *
 * @example
 *
 * const arr = ['a', 'b'] as const
 * type Foo = ValuesOf<typeof arr> // 'a' | 'b'
 */
export type ValuesOf<T extends readonly any[]> = T[number]

/**
 * Based on: https://stackoverflow.com/a/49286056/4919972
 *
 * @example
 *
 * type Foo = { a: string, b: number }
 * type ValueOfFoo = ValueOf<Foo> // string | number
 */
export type ValueOf<T> = T[keyof T]

export type KeyValueTuple<K, V> = [key: K, value: V]

// Exclude<something, undefined> is used here to support StringMap<OBJ> (because values of StringMap add `undefined`)
export type ObjectMapper<OBJ, OUT> = (
  key: keyof OBJ,
  value: Exclude<OBJ[keyof OBJ], undefined>,
  obj: OBJ,
) => OUT

export type ObjectPredicate<OBJ> = (
  key: keyof OBJ,
  value: Exclude<OBJ[keyof OBJ], undefined>,
  obj: OBJ,
) => boolean

/**
 * Allows to identify instance of Class by `instanceId`.
 */
export interface InstanceId {
  /**
   * Unique id of this instance of the Class.
   */
  instanceId: string
}

/**
 * Interface explicitly states that the value is an ISO Date string (without time).
 *
 * @example '2019-06-21'
 */
export type IsoDateString = string

/**
 * Interface explicitly states that the value is an ISO DateTime string (with time).
 *
 * @example '2019-06-21T05:21:73Z'
 */
export type IsoDateTimeString = string

/**
 * Identifies the Month.
 * Like IsoDateString, but without the Day token.
 *
 * @example '2023-09'
 */
export type MonthId = string

/**
 * Interface explicitly states that the value is a Unix timestamp (in seconds).
 *
 * @example 1628945450
 */
export type UnixTimestampNumber = number

/**
 * Interface explicitly states that the value is a "Unix timestamp in **milleseconds**" (not seconds)
 *
 * @example 1628945450000
 */
export type UnixTimestampMillisNumber = number

export type NumberOfSeconds = number
export type NumberOfMilliseconds = number

/**
 * Same as `number`, but with semantic meaning that it's an Integer.
 */
export type Integer = number

/**
 * Convenience type alias, that allows to write this:
 *
 * data: NullableNumber[]
 *
 * instead of this:
 *
 * data: (number | null)[]
 */
export type NullableNumber = number | null
export type NullableString = string | null
export type NullableBoolean = boolean | null
export type NullableBuffer = Buffer | null

/**
 * Used as a compact representation of truthy value.
 * undefined ('' or other short falsy value) should be used as falsy value.
 */
export type ShortBoolean = '1'

export type Base64String = string
export type Base64UrlString = string
export type JWTString = string

export type SemVerString = string

/**
 * Named type for JSON.parse / JSON.stringify second argument
 */
export type Reviver = (this: any, key: string, value: any) => any

/**
 * Needed due to https://github.com/microsoft/TypeScript/issues/13778
 * Only affects typings, no runtime effect.
 */
export const _stringMapValues = Object.values as <T>(m: StringMap<T>) => T[]

/**
 * Needed due to https://github.com/microsoft/TypeScript/issues/13778
 * Only affects typings, no runtime effect.
 */
export const _stringMapEntries = Object.entries as <T>(m: StringMap<T>) => [k: string, v: T][]

/**
 * Alias of `Object.keys`, but returns keys typed as `keyof T`, not as just `string`.
 * This is how TypeScript should work, actually.
 */
export const _objectKeys = Object.keys as <T extends AnyObject>(obj: T) => (keyof T)[]

/**
 * Alias of `Object.entries`, but returns better-typed output.
 *
 * So e.g you can use _objectEntries(obj).map([k, v] => {})
 * and `k` will be `keyof obj` instead of generic `string`.
 */
export const _objectEntries = Object.entries as <T extends AnyObject>(
  obj: T,
) => [k: keyof T, v: T[keyof T]][]

export type NullishValue = null | undefined
export type FalsyValue = false | '' | 0 | null | undefined

/**
 * Utility function that helps to cast *existing variable* to needed type T.
 *
 * @example
 * try {} catch (err) {
 *   // err is unknown here
 *   _typeCast<AppError>(err)
 *   // now err is of type AppError
 *   err.data = {} // can be done, because it was casted
 * }
 */
export function _typeCast<T>(v: any): asserts v is T {}

/**
 * Type-safe Object.assign that checks that part is indeed a Partial<T>
 */
export const _objectAssign = Object.assign as <T extends AnyObject>(
  target: T,
  part: Partial<T>,
) => T

/**
 * Defines a tuple of [err, data]
 * where only 1 of them exists.
 * Either error exists and data is null
 * Or error is null and data is defined.
 * This forces you to check `if (err)`, which lets
 * TypeScript infer the existence of `data`.
 *
 * Functions like pTry use that.
 */
export type ErrorDataTuple<T = unknown, ERR = Error> = [err: null, data: T] | [err: ERR, data: null]

export type SortDirection = 'asc' | 'desc'

export type Inclusiveness = '()' | '[]' | '[)' | '(]'
