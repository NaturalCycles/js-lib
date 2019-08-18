import { pMap, PMapOptions } from './pMap'

export type FilterFn<T> = (item: T, index: number) => boolean | PromiseLike<boolean>

export async function pFilter<T> (
  iterable: Iterable<T | PromiseLike<T>>,
  filterFn: FilterFn<T>,
  options?: PMapOptions,
): Promise<T[]> {
  const values = await pMap(
    iterable,
    async (item, index) => Promise.all([filterFn(item, index), item]),
    options,
  )

  return values.filter(value => Boolean(value[0])).map(value => value[1])
}
