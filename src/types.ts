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
