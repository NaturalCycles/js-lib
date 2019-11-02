import { Predicate } from '../types'
import { pMap, PMapOptions } from './pMap'

export async function pFilter<T>(
  iterable: Iterable<T | PromiseLike<T>>,
  filterFn: Predicate<T>,
  options?: PMapOptions,
): Promise<T[]> {
  const values = await pMap(
    iterable,
    async (item, index) => await Promise.all([filterFn(item, index), item]),
    options,
  )

  return values.filter(value => Boolean(value[0])).map(value => value[1])
}
