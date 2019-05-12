/**
 * Map from String to String (or <T>).
 */
export interface StringMap<T = string> {
  [k: string]: T
}

/**
 * Object to be passed to pProps to resolve all promises into properties.
 */
export interface PromiseMap {
  [prop: string]: Promise<any>
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
