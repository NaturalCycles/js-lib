import { StringMap } from '../types'

export class ObjectUtil {
  // Picks just allowed fields and no other fields
  // pick<T> (obj: any, fields: string[], initialObject = {}): T {
  pick<T> (obj: T, fields?: string[], initialObject: Partial<T> = {}): T {
    if (!obj || !fields || !fields.length) return obj

    const o: any = initialObject

    fields.forEach(k => {
      if (k in obj) o[k] = (obj as any)[k]
    })

    return o
  }

  /**
   * Does NOT mutate (unless "mutate" flag is set)
   * Removes "falsy" value from the object.
   */
  filterFalsyValues<T> (_obj: T, mutate = false): T {
    return this.filterValues(_obj, (k, v) => !!v, mutate)
  }

  filterEmptyStringValues<T> (_obj: T, mutate = false): T {
    return this.filterValues(_obj, (k, v) => v !== '', mutate)
  }

  filterUndefinedValues<T> (_obj: T, mutate = false): T {
    return this.filterValues(_obj, (k, v) => v !== undefined && v !== null, mutate)
  }

  filterValues<T> (_obj: T, predicate: (key: any, value: any) => boolean, mutate = false): T {
    if (!this.isObject(_obj)) return _obj

    const o: any = mutate ? _obj : { ...(_obj as any) }

    Object.keys(o).forEach(k => {
      const keep = predicate(k, o[k])
      if (!keep) delete o[k]
    })

    return o
  }

  transformValues<T> (_obj: T, transformFn: (key: any, value: any) => any, mutate = false): T {
    if (!this.isObject(_obj)) return _obj

    const o: any = mutate ? _obj : { ...(_obj as any) }

    Object.keys(o).forEach(k => {
      o[k] = transformFn(k, o[k])
    })

    return o
  }

  objectNullValuesToUndefined<T> (_obj: T, mutate = false): T {
    return this.transformValues(
      _obj,
      (k, v) => {
        if (v === null) return undefined
        return v
      },
      mutate,
    )
  }

  deepEquals (a: object, b: object): boolean {
    return JSON.stringify(this.sortObjectDeep(a)) === JSON.stringify(this.sortObjectDeep(b))
  }

  /**
   * Deep copy object (by json parse/stringify).
   */
  deepCopy<T> (o: T): T {
    return JSON.parse(JSON.stringify(o))
  }

  isObject (item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null) || false
  }

  isEmptyObject (obj: any): boolean {
    return obj && obj.constructor === Object && Object.keys(obj).length === 0
  }

  // from: https://gist.github.com/Salakar/1d7137de9cb8b704e48a
  mergeDeep (target: any, source: any): any {
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} })
          this.mergeDeep(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      })
    }
    return target
  }

  /**
   * Mutates
   */
  deepTrim (o: any): any {
    if (!o) return o

    if (typeof o === 'string') {
      return o.trim()
    } else if (typeof o === 'object') {
      Object.keys(o).forEach(k => {
        o[k] = this.deepTrim(o[k])
      })
    }

    return o
  }

  private defaultSortFn (a: any, b: any): number {
    return a.localeCompare(b)
  }

  // based on: https://github.com/IndigoUnited/js-deep-sort-object
  sortObjectDeep<T> (o: T): T {
    // array
    if (Array.isArray(o)) {
      return o.map(i => this.sortObjectDeep(i)) as any
    }

    if (this.isObject(o)) {
      const out: any = {}

      Object.keys(o)
        .sort((a, b) => this.defaultSortFn(a, b))
        .forEach(k => {
          out[k] = this.sortObjectDeep((o as any)[k])
        })

      return out
    }

    return o
  }

  // from: https://github.com/jonschlinkert/unset-value
  // mutates obj
  unsetValue (obj: any, prop: string): void {
    if (!this.isObject(obj)) {
      return
    }
    if (obj.hasOwnProperty(prop)) {
      delete obj[prop]
      return
    }

    const segs = prop.split('.')
    let last = segs.pop()
    while (segs.length && segs[segs.length - 1].slice(-1) === '\\') {
      last = segs.pop()!.slice(0, -1) + '.' + last
    }
    while (segs.length && this.isObject(obj)) {
      const k = (prop = segs.shift()!)
      obj = obj[k]
    }
    if (!this.isObject(obj)) return
    delete obj[last!]
  }

  /**
   * Returns object with filtered keys from "exclude" array.
   * E.g:
   * mask({...}, [
   *  'account.id',
   *  'account.updated',
   * ])
   *
   * Pass deepCopy if you want to protect the whole object (not just first level) from mutation.
   */
  mask<T extends object> (_o: T, exclude: string[], deepCopy = false): T {
    let o = { ...(_o as object) }
    if (deepCopy) o = this.deepCopy(o)

    exclude.forEach(e => {
      // eval(`delete o.${e}`)
      this.unsetValue(o, e)
    })
    return o as T
  }

  /**
   * Turns ['a', b'] into {a: true, b: true}
   */
  arrayToHash (a: any[] = []): { [k: string]: boolean } {
    return a.reduce((o, item) => {
      o[item] = true
      return o
    }, {})
  }

  classToPlain<T = any> (obj: any = {}): T {
    return JSON.parse(JSON.stringify(obj))
  }

  getKeyByValue<T = any> (object: any, value: any): T | undefined {
    if (!this.isObject(object)) return
    return Object.keys(object).find(k => object[k] === value) as any
  }

  invertObject<T> (o: any): T {
    const inv: any = {}
    Object.keys(o).forEach(k => {
      inv[o[k]] = k
    })
    return inv
  }

  invertMap<K, V> (m: Map<K, V>): Map<V, K> {
    const inv = new Map<V, K>()
    m.forEach((v, k) => inv.set(v, k))
    return inv
  }

  by<T = any> (items: T[] = [], by: string): StringMap<T> {
    const r: StringMap<T> = {}
    items.forEach((item: any) => {
      if (item[by]) r[item[by]] = item
    })
    return r
  }
}

export const objectUtil = new ObjectUtil()
