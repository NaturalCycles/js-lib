/*
Inspired by Bluebird Promise.props() and https://github.com/sindresorhus/p-props

Improvements:

- Exported as { pProps }, so IDE auto-completion works
- Simpler: no support for Map, Mapper, Options
- Included Typescript typings (no need for @types/p-props)
 */

import { PromiseValue } from '../typeFest'
import { pMap, PMapOptions } from './pMap'

/**
 * Promise.all for Object instead of Array.
 * Supports concurrency.
 */
export async function pProps<T extends Record<string, any>>(
  input: T,
  opt?: PMapOptions,
): Promise<{ [key in keyof T]: PromiseValue<T[key]> }> {
  const keys = Object.keys(input) as (keyof T)[]
  const values = await pMap(Object.values(input), r => r, opt)

  const r = {} as { [key in keyof T]: PromiseValue<T[key]> }
  values.forEach((v, i) => {
    r[keys[i]!] = v
  })
  return r
}
