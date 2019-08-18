/*
Inspired by Bluebird Promise.props() and https://github.com/sindresorhus/p-props

Improvements:

- Exported as { pProps }, so IDE auto-completion works
- Simpler: no support for Map, Mapper, Options
- Included Typescript typings (no need for @types/p-props)
 */

import { pMap, PMapOptions } from './pMap'

/**
 * Promise.all for Object instead of Array.
 * Supports concurrency.
 */
export async function pProps<T> (
  input: { [K in keyof T]: T[K] | Promise<T[K]> },
  opts?: PMapOptions,
): Promise<T> {
  const keys = Object.keys(input)
  const values = await pMap(Object.values(input), r => r, opts)

  const r = {} as T
  values.forEach((v, i) => {
    r[keys[i]] = v
  })
  return r
}
