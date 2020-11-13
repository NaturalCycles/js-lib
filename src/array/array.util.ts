import { RecursiveArray } from '../lodash.types'
import { Mapper, Predicate, StringMap } from '../types'

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
export function _chunk<T>(array: readonly T[], size = 1): T[][] {
  return array.reduce((arr, item, idx) => {
    return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [] as T[][])
}

/**
 * Polyfill to Array.flat() with depth=1.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 */
export function _flatten<T>(arrays: T[][]): T[] {
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
export function _flattenDeep<T>(arr: RecursiveArray<T>): T[] {
  return Array.isArray(arr)
    ? arr.reduce((a: RecursiveArray<T>, b) => a.concat(_flattenDeep(b as RecursiveArray<T>)), [])
    : ([arr] as any)
}

/**
 * Removes duplicates from given array.
 */
export function _uniq<T>(a: readonly T[]): T[] {
  return [...new Set(a)]
}

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
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
export function _uniqBy<T>(arr: readonly T[], mapper: Mapper<T, any>): T[] {
  return [
    ...arr
      .reduce((map, item, index) => {
        const key = item === null || item === undefined ? item : mapper(item, index)

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
 * _by(a, r => r.id)
 * // => {
 *   id1: {id: 'id1', a: 'a1'},
 *   id2: {id: 'id2', b: 'b1'},
 * }
 *
 * _by(a, r => r.id.toUpperCase())
 * // => {
 *   ID1: {id: 'id1', a: 'a1'},
 *   ID2: {id: 'id2', b: 'b1'},
 * }
 *
 * Returning `undefined` from the Mapper will EXCLUDE the item.
 */
export function _by<T>(items: readonly T[], mapper: Mapper<T, any>): StringMap<T> {
  return items.reduce((map, item, index) => {
    const res = mapper(item, index)
    if (res !== undefined) map[res] = item
    return map
  }, {} as StringMap<T>)
}

/**
 * const a = [1, 2, 3, 4, 5]
 *
 * _groupBy(a, r => r % 2 ? 'even' : 'odd')
 * // => {
 *   odd: [1, 3, 5],
 *   even: [2, 4],
 * }
 *
 * Returning `undefined` from the Mapper will EXCLUDE the item.
 */
export function _groupBy<T>(items: readonly T[], mapper: Mapper<T, any>): StringMap<T[]> {
  return items.reduce((map, item, index) => {
    const res = mapper(item, index)
    if (res !== undefined) {
      map[res] = [...(map[res] || []), item]
    }
    return map
  }, {} as StringMap<T[]>)
}

/**
 * _sortBy([{age: 20}, {age: 10}], 'age')
 * // => [{age: 10}, {age: 20}]
 *
 * Same:
 * _sortBy([{age: 20}, {age: 10}], o => o.age)
 */
export function _sortBy<T>(items: T[], mapper: Mapper<T, any>, mutate = false): T[] {
  return (mutate ? items : [...items]).sort((_a, _b) => {
    const [a, b] = [_a, _b].map(mapper)
    if (typeof a === 'number' && typeof b === 'number') return a - b
    return String(a).localeCompare(String(b))
  })
}

/**
 * Like items.find(), but it tries to find from the END of the array.
 */
export function _findLast<T>(items: T[], predicate: Predicate<T>): T | undefined {
  return [...items].reverse().find(predicate)
}

export function _takeWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = true
  return items.filter((v, index) => (proceed = proceed && predicate(v, index)))
}

export function _takeRightWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = true
  return [...items].reverse().filter((v, index) => (proceed = proceed && predicate(v, index)))
}

export function _dropWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = false
  return items.filter((v, index) => (proceed = proceed || !predicate(v, index)))
}

export function _dropRightWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = false
  return [...items]
    .reverse()
    .filter((v, index) => (proceed = proceed || !predicate(v, index)))
    .reverse()
}

export function _countBy<T, V = any>(items: T[], mapper: Mapper<T, any>): StringMap<number> {
  return items.reduce((map, item, index) => {
    const key = mapper(item, index)
    map[key] = (map[key] || 0) + 1
    return map
  }, {})
}

// investigate: _groupBy, _clamp

/**
 * @example
 * _intersection([2, 1], [2, 3])
 * // [2]
 */
export function _intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [] // edge case
  return arrays.reduce((a, b) => a.filter(v => b.includes(v)))
}

/**
 * @example
 * _difference([2, 1], [2, 3])
 * // [1]
 */
export function _difference<T>(source: T[], ...diffs: T[][]): T[] {
  return diffs.reduce((a, b) => a.filter(c => !b.includes(c)), source)
}
