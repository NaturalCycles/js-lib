export function flatten<T> (arrays: T[][]): T[] {
  // to flat single level array
  return ([] as T[]).concat(...arrays)
}
