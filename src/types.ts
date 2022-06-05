import { Except, Merge, Promisable } from './typeFest'

/**
 * Map from String to String (or <T>).
 *
 * Alternative: Record<string, T | undefined>
 */
export interface StringMap<T = string> {
  [k: string | number]: T | undefined
}

/**
 * Object to be passed to pProps to resolve all promises into properties.
 *
 * Alternative: Record<String, Promise<any>>
 */
export interface PromiseMap {
  [prop: string]: Promise<any> | undefined
}

/**
 * Convenience shorthand for `Record<string, any>`.
 * Because `object` type is not safe/recommended to be used (e.g discouraged by eslint-typescript due to: https://github.com/microsoft/TypeScript/issues/21732)
 */
export type AnyObject = Record<string, any>

export interface CreatedUpdated {
  created: number
  updated: number
}

export interface CreatedUpdatedId<ID extends string | number = string | number>
  extends CreatedUpdated {
  id: ID
}

export interface ObjectWithId<ID extends string | number = string | number> {
  id: ID
}

export interface AnyObjectWithId<ID extends string | number = string | number>
  extends AnyObject,
    ObjectWithId<ID> {}

/**
 * Base interface for any Entity that was saved to DB.
 */
export interface SavedDBEntity<ID extends string | number = string> {
  id: ID

  /**
   * unixTimestamp of when the entity was first created (in the DB).
   */
  created: UnixTimestampNumber

  /**
   * unixTimestamp of when the entity was last updated (in the DB).
   */
  updated: UnixTimestampNumber
}

/**
 * Base interface for any Entity that can be saved to DB.
 * This interface fits when entity was NOT YET saved to DB,
 * hence `id`, `created` and `updated` fields CAN BE undefined (yet).
 * When it's known to be saved - `SavedDBEntity` interface can be used instead.
 */
export type BaseDBEntity<ID extends string | number = string> = Partial<SavedDBEntity<ID>>

export type Saved<T extends Partial<ObjectWithId>> = Merge<
  T,
  SavedDBEntity<Exclude<T['id'], undefined>>
>

export type Unsaved<T extends Partial<ObjectWithId>> = Merge<
  T,
  BaseDBEntity<Exclude<T['id'], undefined>>
>

export type UnsavedId<T extends Partial<ObjectWithId>> = Except<T, 'id'> & {
  id: Exclude<T['id'], undefined>
}

/**
 * Convenience type shorthand.
 * Because `Function` type is discouraged by eslint.
 */
export type AnyFunction = (...args: any[]) => any

/**
 * Symbol to indicate END of Sequence.
 */
export const END = Symbol('END')

/**
 * Symbol to indicate SKIP of item (e.g in AbortableMapper)
 */
export const SKIP = Symbol('SKIP')

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
  key: string,
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
 * @deprecated use IsoDateString
 */
export type IsoDate = string

/**
 * Interface explicitly states that the value is an ISO DateTime string (with time).
 *
 * @example '2019-06-21T05:21:73Z'
 */
export type IsoDateTimeString = string

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

/**
 * @deprecated use UnixTimestampNumber
 */
export type UnixTimestamp = number

/**
 * Same as `number`, but with semantic meaning that it's an Integer.
 */
export type Integer = number

/**
 * Named type for JSON.parse / JSON.stringify second argument
 */
export type Reviver = (this: any, key: string, value: any) => any

/**
 * Needed due to https://github.com/microsoft/TypeScript/issues/13778
 * Only affects typings, no runtime effect.
 */
export function _stringMapValues<T>(m: StringMap<T>): T[] {
  return Object.values(m) as T[]
}

/**
 * Needed due to https://github.com/microsoft/TypeScript/issues/13778
 * Only affects typings, no runtime effect.
 */
export function _stringMapEntries<T>(m: StringMap<T>): [k: string, v: T][] {
  return Object.entries(m) as [string, T][]
}

/**
 * Like `Object.keys`, but returns keys typed as `keyof T`, not as just `string`.
 * This is how TypeScript should work, actually.
 *
 * @experimental
 */
export function _objectKeys<T extends AnyObject>(obj: T): (keyof T)[] {
  return Object.keys(obj)
}
