import { NotVoid, RecursiveArray, StringIteratee, ValueIteratee } from './lodash.types'

/**
 * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the
 * final chunk will be the remaining elements.
 *
 * @param array The array to process.
 * @param size The length of each chunk.
 * @return Returns the new array containing chunks.
 *
 * https://lodash.com/docs#chunk
 *
 * Based on: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_chunk
 */
export function _chunk<T> (array: T[], size = 1): T[][] {
  return array.reduce(
    (arr, item, idx) => {
      return idx % size === 0
        ? [...arr, [item]]
        : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
    },
    [] as T[][],
  )
}

/**
 * Polyfill to Array.flat() with depth=1.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 */
export function _flatten<T> (arrays: T[][]): T[] {
  // to flat single level array
  return ([] as T[]).concat(...arrays)
}

/**
 * Recursively flattens a nested array.
 *
 * @param arr The array to recursively flatten.
 * @return Returns the new flattened array.
 *
 * Based on: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_flattendeep
 */
export function _flattenDeep<T> (arr: RecursiveArray<T>): T[] {
  return Array.isArray(arr)
    ? arr.reduce((a: RecursiveArray<T>, b) => a.concat(_flattenDeep(b as RecursiveArray<T>)), [])
    : ([arr] as any)
}

/**
 * Removes duplicates from given array.
 */
export function _uniq<T> (a: T[]): T[] {
  return [...new Set(a)]
}

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
 * @category Array
 * @param arr The array to inspect.
 * @param predicate The iteratee invoked per element.
 * @returns Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // using the `_.property` iteratee shorthand
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 *
 * Based on: https://stackoverflow.com/a/40808569/4919972
 */
export function _uniqBy<T> (arr: T[], predicate: ValueIteratee<T>): T[] {
  const cb = typeof predicate === 'function' ? predicate : (o: T) => o[predicate as any]

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item)

        if (!map.has(key)) map.set(key, item)

        return map
      }, new Map())
      .values(),
  ]
}

/**
 * const a = [
 *  {id: 'id1', a: 'a1'},
 *  {id: 'id2', b: 'b1'},
 * ]
 *
 * by(a, 'k')
 * // => {
 *   id1: {id: 'id1', a: 'a1'},
 *   id2: {id: 'id2', b: 'b1'},
 * }
 *
 * by(a, k => k.id.toUpperCase())
 * // => {
 *   ID1: {id: 'id1', a: 'a1'},
 *   ID2: {id: 'id2', b: 'b1'},
 * }
 */
export function by<T> (items: T[] = [], predicate: StringIteratee<T>): Record<string, T> {
  const cb: (value: T) => string | undefined =
    typeof predicate === 'function' ? predicate : (item: T) => item[predicate]

  return items.reduce(
    (map, item) => {
      const res = cb(item)
      if (res) map[res] = item
      return map
    },
    {} as Record<string, T>,
  )
}

/**
 * _sortBy([{age: 20}, {age: 10}], 'age')
 * // => [{age: 10}, {age: 20}]
 *
 * Same:
 * _sortBy([{age: 20}, {age: 10}], o => o.age)
 */
export function _sortBy<T> (items: T[], predicate: ValueIteratee<T>): T[] {
  const cb: (value: T) => NotVoid =
    typeof predicate === 'function' ? predicate : (item: T) => item[predicate as string]

  return [...items].sort((_a, _b) => {
    const [a, b] = [_a, _b].map(cb)
    if (typeof a === 'number' && typeof b === 'number') return Math.sign(a - b)
    return String(a).localeCompare(String(b))
  })
}

/**
 * Returns an array with ranges from `from` up to (but not including) `to`
 *
 * @example
 * range(3, 6) // [ 3, 4, 5 ]
 */
export function _range (fromIncl: number, toExcl: number): number[] {
  return Array.from({ length: toExcl - fromIncl }, (_v, k) => k + fromIncl)
}
