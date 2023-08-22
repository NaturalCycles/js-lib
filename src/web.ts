/// <reference lib="es2022"/>
/// <reference lib="dom"/>

import { StringMap } from './types'

/**
 * Implements WebStorage API by using in-memory storage.
 * Can be useful in SSR environment or unit tests.
 *
 * @experimental
 */
export class InMemoryWebStorage implements Storage {
  constructor(public data: StringMap = {}) {}

  // Not implementing "free property access" now for simplicity,
  // but can be implemented with Proxy
  // [ name: string ]: any

  getItem(key: string): string | null {
    return this.data[key] ?? null
  }

  setItem(key: string, value: string): void {
    this.data[key] = String(value)
  }

  removeItem(key: string): void {
    delete this.data[key]
  }

  key(index: number): string | null {
    return Object.keys(this.data)[index] ?? null
  }

  clear(): void {
    this.data = {}
  }

  get length(): number {
    return Object.keys(this.data).length
  }
}
