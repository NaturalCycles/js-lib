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

export type ClassType<T = any> = new (...args: any[]) => T

// Based on: https://github.com/Microsoft/TypeScript/issues/13923
export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }
