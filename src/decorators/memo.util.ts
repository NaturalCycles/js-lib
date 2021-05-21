import { _isPrimitive } from '../object/object.util'

export type MemoSerializer = (args: any[]) => any

export const jsonMemoSerializer: MemoSerializer = args => {
  if (!args.length) return undefined
  if (args.length === 1 && _isPrimitive(args[0])) return args[0]
  return JSON.stringify(args)
}

export interface MemoCache {
  has(k: any): boolean
  get(k: any): any
  set(k: any, v: any): void
  clear(): void
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

export class MapMemoCache implements MemoCache {
  private m = new Map<any, any>()

  has(k: any): boolean {
    return this.m.has(k)
  }

  get(k: any): any {
    return this.m.get(k)
  }

  set(k: any, v: any): void {
    this.m.set(k, v)
  }

  clear(): void {
    this.m.clear()
  }
}
