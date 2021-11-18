/*
Inspired by Bluebird Promise.props() and https://github.com/sindresorhus/p-props

Improvements:

- Exported as { pProps }, so IDE auto-completion works
- Simpler: no support for Map, Mapper, Options
- Included Typescript typings (no need for @types/p-props)
 */

import { pMap, PMapOptions } from './pMap'

// todo: remove when eslint starts to know about Awaited
/* eslint-disable no-undef */

/**
 * Promise.all for Object instead of Array.
 * Supports concurrency.
 */
export async function pProps<T>(
  input: { [K in keyof T]: T[K] | Promise<T[K]> },
  opt?: PMapOptions,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const r = {} as { [K in keyof T]: Awaited<T[K]> }
  const keys = Object.keys(input) as (keyof T)[]
  await pMap(Object.values(input), (v, i) => (r[keys[i]!] = v), opt)
  return r
}
