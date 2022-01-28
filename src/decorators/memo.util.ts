import { _isPrimitive } from '../object/object.util'
import { Promisable } from '../typeFest'

export type MemoSerializer = (args: any[]) => any

export const jsonMemoSerializer: MemoSerializer = args => {
  if (args.length === 0) return undefined
  if (args.length === 1 && _isPrimitive(args[0])) return args[0]
  return JSON.stringify(args)
}

export interface MemoCache<KEY = any, VALUE = any> {
  has(k: KEY): boolean
  get(k: KEY): VALUE | undefined
  set(k: KEY, v: VALUE): void

  /**
   * Clear is only called when `.dropCache()` is called.
   * Otherwise the Cache is "persistent" (never cleared).
   */
  clear(): void
}

export interface AsyncMemoCache<KEY = any, VALUE = any> {
  // `has` method is removed, because it is assumed that it has a cost and it's best to avoid doing both `has` and then `get`
  // has(k: any): Promise<boolean>
  /**
   * `undefined` value returned indicates the ABSENCE of value in the Cache.
   * This also means that you CANNOT store `undefined` value in the Cache, as it'll be treated as a MISS.
   * You CAN store `null` value instead, it will be treated as a HIT.
   */
  get(k: KEY): Promisable<VALUE | undefined>
  set(k: KEY, v: VALUE): Promisable<void>

  /**
   * Clear is only called when `.dropCache()` is called.
   * Otherwise the Cache is "persistent" (never cleared).
   */
  clear(): Promisable<void>
}

// SingleValueMemoCache and ObjectMemoCache are example-only, not used in production code
/*
export class SingleValueMemoCache implements MemoCache {
  private v: any = undefined
  private valueSet = false

  has() {
    return this.valueSet
  }

  get() {
    return this.v
  }

  set(_k: any, _v: any) {
    this.v = _v
    this.valueSet = true
  }

  clear() {
    this.valueSet = false
  }
}

export class ObjectMemoCache implements MemoCache {
  private v = {}

  has(k: any) {
    return k in this.v
    // return this.v[k]
  }

  get(k: any) {
    return this.v[k]
  }

  set(k: any, v: any) {
    this.v[k] = v
  }

  clear() {
    this.v = {}
  }
}
 */

export class MapMemoCache<KEY = any, VALUE = any>
  implements MemoCache<KEY, VALUE>, AsyncMemoCache<KEY, VALUE>
{
  private m = new Map<KEY, VALUE>()

  has(k: KEY): boolean {
    return this.m.has(k)
  }

  get(k: KEY): VALUE | undefined {
    return this.m.get(k)
  }

  set(k: KEY, v: VALUE): void {
    this.m.set(k, v)
  }

  clear(): void {
    this.m.clear()
  }
}
