import 'dotenv/config' // ensure .env is read before requiring keys
import type { ValuesOf } from '@naturalcycles/js-lib'
import { fs2 } from '../fs/fs2.js'

/**
 * @example
 *
 * const {a, b} = requreEnvKeys(['a', 'b'])
 *
 * Will throw if any of the passed keys is not defined.
 */
export function requireEnvKeys<T extends readonly string[]>(
  ...keys: T
): { [k in ValuesOf<T>]: string } {
  // eslint-disable-next-line unicorn/no-array-reduce
  return keys.reduce(
    (r, k) => {
      const v = process.env[k]
      if (!v) throw new Error(`${k} env variable is required, but missing`)
      r[k as ValuesOf<T>] = v
      return r
    },
    {} as { [k in ValuesOf<T>]: string },
  )
}

/**
 * @deprecated use fs2.requireFileToExist
 */
export function requireFileToExist(filePath: string): void {
  fs2.requireFileToExist(filePath)
}
