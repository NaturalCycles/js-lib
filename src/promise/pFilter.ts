import type { AsyncPredicate } from '../types'

export async function pFilter<T>(iterable: Iterable<T>, filterFn: AsyncPredicate<T>): Promise<T[]> {
  const items = [...iterable]
  const predicates = await Promise.all(items.map((item, i) => filterFn(item, i)))
  return items.filter((item, i) => predicates[i])
}
