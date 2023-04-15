import { _isNotNullish } from '../is.util'
import type { FalsyValue, Mapper, Predicate, StringMap } from '../types'

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
    return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0]!, item]]
  }, [] as T[][])
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
export function _sortBy<T>(
  items: T[],
  mapper: Mapper<T, any>,
  mutate = false,
  descending = false,
): T[] {
  const mod = descending ? -1 : 1
  return (mutate ? items : [...items]).sort((_a, _b) => {
    const [a, b] = [_a, _b].map(mapper)
    if (typeof a === 'number' && typeof b === 'number') return (a - b) * mod
    return String(a).localeCompare(String(b)) * mod
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
  return items.filter((v, index) => (proceed &&= predicate(v, index)))
}

export function _takeRightWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = true
  return [...items].reverse().filter((v, index) => (proceed &&= predicate(v, index)))
}

export function _dropWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = false
  return items.filter((v, index) => (proceed ||= !predicate(v, index)))
}

export function _dropRightWhile<T>(items: T[], predicate: Predicate<T>): T[] {
  let proceed = false
  return [...items]
    .reverse()
    .filter((v, index) => (proceed ||= !predicate(v, index)))
    .reverse()
}

export function _countBy<T>(items: T[], mapper: Mapper<T, any>): StringMap<number> {
  const map: StringMap<number> = {}

  items.forEach((item, index) => {
    const key = mapper(item, index)
    map[key] = (map[key] || 0) + 1
  })

  return map
}

// investigate: _groupBy

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

/**
 * Returns the sum of items, or 0 for empty array.
 */
export function _sum(items: number[]): number {
  return items.reduce((sum, n) => sum + n, 0)
}

export function _sumBy<T>(items: T[], mapper: Mapper<T, number | undefined>): number {
  return items
    .map((v, i) => mapper(v, i)!)
    .filter(i => typeof i === 'number') // count only numbers, nothing else
    .reduce((sum, n) => sum + n, 0)
}

/**
 * Map an array of T to a StringMap<V>,
 * by returning a tuple of [key, value] from a mapper function.
 * Return undefined/null/false/0/void to filter out (not include) a value.
 *
 * @example
 *
 * _mapToObject([1, 2, 3], n => [n, n * 2])
 * // { '1': 2, '2': 4, '3': 6 }
 *
 * _mapToObject([1, 2, 3], n => [n, `id${n}`])
 * // { '1': 'id1, '2': 'id2', '3': 'id3' }
 */
export function _mapToObject<T, V>(
  array: T[],
  mapper: (item: T) => [key: any, value: V] | FalsyValue,
): StringMap<V> {
  const m: StringMap<V> = {}

  array.forEach(item => {
    const r = mapper(item)
    if (!r) return // filtering

    m[r[0]] = r[1]
  })

  return m
}

/**
 * Randomly shuffle an array values.
 * Fisher–Yates algorithm.
 * Based on: https://stackoverflow.com/a/12646864/4919972
 */
export function _shuffle<T>(array: T[], mutate = false): T[] {
  const a = mutate ? array : [...array]

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }

  return a
}

/**
 * Returns last item of non-empty array.
 * Throws if array is empty.
 */
export function _last<T>(array: T[]): T {
  if (!array.length) throw new Error('_last called on empty array')
  return array[array.length - 1]!
}

/**
 * Returns last item of the array (or undefined if array is empty).
 */
export function _lastOrUndefined<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}

export function _minOrUndefined<T>(array: T[]): NonNullable<T> | undefined {
  const a = array.filter(_isNotNullish)
  if (!a.length) return
  return _min(a)
}

/**
 * Filters out nullish values (undefined and null).
 */
export function _min<T>(array: T[]): NonNullable<T> {
  const a = array.filter(_isNotNullish)
  if (!a.length) throw new Error('_min called on empty array')
  return a.reduce((min, item) => (min <= item ? min : item))
}

export function _maxOrUndefined<T>(array: T[]): NonNullable<T> | undefined {
  const a = array.filter(_isNotNullish)
  if (!a.length) return
  return _max(a)
}

/**
 * Filters out nullish values (undefined and null).
 */
export function _max<T>(array: T[]): NonNullable<T> {
  const a = array.filter(_isNotNullish)
  if (!a.length) throw new Error('_max called on empty array')
  return a.reduce((max, item) => (max >= item ? max : item))
}

export function _maxBy<T>(array: T[], mapper: Mapper<T, number | undefined>): T {
  const max = _maxByOrUndefined(array, mapper)
  if (max === undefined) throw new Error(`_maxBy returned undefined`)
  return max
}

export function _minBy<T>(array: T[], mapper: Mapper<T, number | undefined>): T {
  const min = _minByOrUndefined(array, mapper)
  if (min === undefined) throw new Error(`_minBy returned undefined`)
  return min
}

// todo: looks like it _maxByOrUndefined/_minByOrUndefined can be DRYer

export function _maxByOrUndefined<T>(
  array: T[],
  mapper: Mapper<T, number | undefined>,
): T | undefined {
  if (!array.length) return
  let maxItem: T | undefined
  let max: number | undefined
  array.forEach((item, i) => {
    const v = mapper(item, i)
    if (v !== undefined && (max === undefined || v > max)) {
      maxItem = item
      max = v
    }
  })

  return maxItem
}

export function _minByOrUndefined<T>(
  array: T[],
  mapper: Mapper<T, number | undefined>,
): T | undefined {
  if (!array.length) return
  let minItem: T | undefined
  let min: number | undefined
  array.forEach((item, i) => {
    const v = mapper(item, i)
    if (v !== undefined && (min === undefined || v < min)) {
      minItem = item
      min = v
    }
  })

  return minItem
}
