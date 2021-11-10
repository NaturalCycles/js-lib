import { Merge } from './typeFest'

/**
 * Map from String to String (or <T>).
 *
 * Alternative: Record<string, T | undefined>
 */
export interface StringMap<T = string> {
  [k: string]: T | undefined
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

export interface CreatedUpdatedId extends CreatedUpdated {
  id: string
}

export interface ObjectWithId {
  id: string
}

export interface AnyObjectWithId extends AnyObject, ObjectWithId {}

/**
 * Convenience type shorthand.
 * Because `Function` type is discouraged by eslint.
 */
export type AnyFunction = (...args: any[]) => any

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

export type ObjectMapper<OBJ, OUT> = (key: string, value: OBJ[keyof OBJ], obj: OBJ) => OUT

export type ObjectPredicate<OBJ> = (key: keyof OBJ, value: OBJ[keyof OBJ], obj: OBJ) => boolean

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
export type IsoDate = string

/**
 * Interface explicitly states that the value is an ISO DateTime string (with time).
 *
 * @example '2019-06-21T05:21:73Z'
 */
export type IsoDateTime = string

/**
 * Interface explicitly states that the value is a Unix timestamp (in seconds).
 *
 * @example 1628945450
 */
export type UnixTimestamp = number

/**
 * Base interface for any Entity that was saved to DB.
 */
export interface SavedDBEntity {
  id: string

  /**
   * unixTimestamp of when the entity was first created (in the DB).
   */
  created: UnixTimestamp

  /**
   * unixTimestamp of when the entity was last updated (in the DB).
   */
  updated: UnixTimestamp
}

/**
 * Base interface for any Entity that can be saved to DB.
 * This interface fits when entity was NOT YET saved to DB,
 * hence `id`, `created` and `updated` fields CAN BE undefined (yet).
 * When it's known to be saved - `SavedDBEntity` interface can be used instead.
 */
export type BaseDBEntity = Partial<SavedDBEntity>

export type Saved<E> = Merge<E, SavedDBEntity>
export type Unsaved<E> = Merge<E, BaseDBEntity>

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
