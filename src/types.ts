/**
 * Map from String to String (or <T>).
 *
 * Alternative: Record<string, T>
 */
export interface StringMap<T = string> {
  [k: string]: T
}

/**
 * Object to be passed to pProps to resolve all promises into properties.
 *
 * Alternative: Record<String, Promise<any>>
 */
export interface PromiseMap {
  [prop: string]: Promise<any>
}

/**
 * Function which is called for every item in `input`. Expected to return a `Promise` or value.
 *
 * @param input - Iterated element.
 * @param index - Index of the element in the source array.
 */
export type Mapper<IN = any, OUT = any> = (input: IN, index: number) => OUT | PromiseLike<OUT>

export const passthroughMapper: Mapper<any, any> = item => item
export const passUndefinedMapper: Mapper<any, void> = () => undefined

export type Predicate<T> = (item: T, index: number) => boolean | PromiseLike<boolean>

export const passthroughPredicate: Predicate<any> = () => true
export const passNothingPredicate: Predicate<any> = () => false

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
 * @example
 *
 * const arr = ['a', 'b'] as const
 * type Foo = ValuesOf<typeof arr> // 'a' | 'b'
 *
 * Based on: https://github.com/Microsoft/TypeScript/issues/20965#issuecomment-354858633
 */
export type ValuesOf<T extends readonly any[]> = T[number]

/**
 * @example
 *
 * type Foo = { a: string, b: number }
 * type ValueOfFoo = ValueOf<Foo> // string | number
 *
 * Based on: https://stackoverflow.com/a/49286056/4919972
 */
export type ValueOf<T> = T[keyof T]

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
 * @example '2019-06-21'
 */
export type IsoDate = string

/**
 * @example '2019-06-21T05:21:73Z'
 */
export type IsoDateTime = string
