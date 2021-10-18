import { deepFreeze } from '@naturalcycles/dev-lib/dist/testing'
import {
  _deepCopy,
  _deepTrim,
  _filterEmptyArrays,
  _filterEmptyValues,
  _filterFalsyValues,
  _filterNullishValues,
  _filterObject,
  _filterUndefinedValues,
  _findKeyByValue,
  _get,
  _has,
  _invert,
  _invertMap,
  _isEmpty,
  _isEmptyObject,
  _isObject,
  _isPrimitive,
  _mapKeys,
  _mapObject,
  _mapValues,
  _mask,
  _merge,
  _objectNullValuesToUndefined,
  _omit,
  _pick,
  _set,
  _undefinedIfEmpty,
  _unset,
} from './object.util'

test('_pick', () => {
  const f = _pick

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
  }

  // empty fields
  expect(f(obj, [])).toEqual({})

  const fields = ['a', 'c', 'd', 'e'] as const
  const r = f(obj, fields as any)
  // console.log(r)
  expect(r).toEqual({ a: 1, c: 3, d: false })
  expect('e' in r).toBe(false) // should not add more fields with 'undefined' value
  // should not mutate
  expect(obj.c).toBe(3)
  expect(r).not.toBe(obj)

  // should mutate
  const obj2 = f(obj, ['a'], true)
  expect(obj2).toEqual({
    a: 1,
  })
  expect(obj2).toBe(obj)
})

test('_omit', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
    e: undefined,
  }

  deepFreeze(obj)

  // expect(_omit(obj)).toEqual(obj)

  // empty props
  expect(_omit(obj, [])).toEqual(obj)

  expect(_omit(obj, ['b', 'c'])).toEqual({
    a: 1,
    d: false,
    e: undefined,
  })

  expect(_omit(obj, ['a', 'd', 'e'])).toEqual({
    b: 2,
    c: 3,
  })
})

test('_omit mutate', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
    e: undefined,
  }

  const obj2 = _omit(obj, ['b', 'c'], true)
  expect(obj2).toEqual({
    a: 1,
    d: false,
    e: undefined,
  })
  expect(obj2).toBe(obj)
})

test('_mask', () => {
  const o = {
    a: '1',
    b: {
      c: '2',
      d: '1',
    },
  }
  deepFreeze(o)
  const r = _mask(o, ['b.c'])
  expect(r).toMatchInlineSnapshot(`
    Object {
      "a": "1",
      "b": Object {
        "d": "1",
      },
    }
  `)

  // should not fail
  expect(_mask(o, ['c.0.0'])).toEqual(o)
})

test('_mask with mutation', () => {
  const o = {
    a: '1',
    b: {
      c: '2',
      d: '1',
      e: {
        f: 7,
      },
    },
  }
  const r = _mask(o, ['b.c'], true)
  expect(r).toMatchInlineSnapshot(`
    Object {
      "a": "1",
      "b": Object {
        "d": "1",
        "e": Object {
          "f": 7,
        },
      },
    }
  `)
  expect(r.b).toEqual(o.b) // cause it will mutate r.b
  expect(r).toBe(o)
})

test('_deepTrim', () => {
  const f = _deepTrim
  const o = {
    a: 'abc ',
    b: 'c',
    d: 12,
    e: {
      f: '  sd a ',
    },
  }
  f(o)

  expect(o).toEqual({
    a: 'abc',
    b: 'c',
    d: 12,
    e: {
      f: 'sd a',
    },
  })

  // expect(f(undefined)).toBe(undefined)

  expect(
    _deepTrim({
      a: ' b',
      c: 'd ',
      e: ' f ',
      g: 'hh',
    }),
  ).toEqual({
    a: 'b',
    c: 'd',
    e: 'f',
    g: 'hh',
  })
})

test('_filterFalsyValues', () => {
  const f = _filterFalsyValues
  const o = Object.freeze({
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    e: '',
    f: 'wer',
  })
  expect(f(o)).toEqual({
    a: 1,
    f: 'wer',
  })
  // should NOT mutate
  expect(o.b).toBe(0)

  // should mutate if needed
  const o2 = { ...o }
  f(o2, true)
  expect(o2.b).toBe(undefined)
})

test('_filterNullishValues', () => {
  const o = {
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    e: '',
    f: 'wer',
  }
  deepFreeze(o)

  expect(_filterNullishValues(o)).toEqual({
    a: 1,
    b: 0,
    e: '',
    f: 'wer',
  })

  const _f = _filterNullishValues(o)
})

test('_filterUndefinedValues', () => {
  const o = {
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    e: '',
    f: 'wer',
  }
  deepFreeze(o)

  expect(_filterUndefinedValues(o)).toEqual({
    a: 1,
    b: 0,
    d: null,
    e: '',
    f: 'wer',
  })
})

test('_filterEmptyArrays', () => {
  expect(_filterEmptyArrays({})).toEqual({})
  expect(_filterEmptyArrays({ a: 'a' })).toEqual({ a: 'a' })
  expect(_filterEmptyArrays({ a: 'a', b: [], c: 'c' })).toEqual({ a: 'a', c: 'c' })
})

test.each([
  [undefined, true],
  [null, true],
  ['', true],
  [{}, true],
  [[], true],
  [new Map(), true],
  [new Set(), true],
  [0, false],
  [1, false],
  ['a', false],
  [{ a: 'a' }, false],
  [['a'], false],
  [[undefined], false],
  [[{}], false],
  [new Map([['a', 'b']]), false],
  [new Set(['']), false],
  [false, false],
  [true, false],
])('_isEmpty %s == %s', (v, empty) => {
  expect(_isEmpty(v)).toBe(empty)
  expect(_undefinedIfEmpty(v)).toBe(empty ? undefined : v)
})

test('_filterEmptyValues', () => {
  expect(
    _filterEmptyValues({
      a: 0,
      b: '',
      c: [],
      d: {},
      e: {
        f: [],
      },
      g: new Set(),
      h: 'h',
    }),
  ).toEqual({
    a: 0,
    e: {
      f: [],
    },
    h: 'h',
  })
})

test('_filterObject', () => {
  // expect(_filterObject(1 as any, () => false)).toBe(1)

  const f = _filterObject
  const br = {
    a: 'b',
    c: null,
  }

  // should mutate
  f(br, (k: any, v: any) => v !== null, true)
  expect(br.c).toBeUndefined()
})

test('_objectNullValuesToUndefined', () => {
  const o = {
    a: undefined,
    b: null,
    c: 1,
  }
  const o2 = {
    a: undefined,
    b: undefined,
    c: 1,
  }

  expect(_objectNullValuesToUndefined(o)).toEqual(o2)

  // mutate
  _objectNullValuesToUndefined(o, true)
  expect(o).toEqual(o2)
})

test('_unset', () => {
  expect(_unset(1 as any, 'a')).toBeUndefined()

  const o = {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
    m: 5,
  }
  _unset(o, 'b.c')
  _unset(o, 'm')
  expect(o).toEqual({
    a: 1,
    b: {
      d: 4,
    },
  })
  expect(o.m).toBeUndefined()
  expect(o.b.c).toBeUndefined()
})

test('_deepCopy', () => {
  const o = {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
  }
  expect(_deepCopy(o)).toEqual(o)
})

test('_isObject', () => {
  expect(_isObject(undefined)).toBe(false)
})

test('_isEmptyObject', () => {
  const a = [1, 0, -1, undefined, null, 'wer', 'a', '', {}, { a: 'b' }]

  const empty = a.filter(i => _isEmptyObject(i))
  expect(empty).toEqual([{}])
})

test('_merge', () => {
  expect(_merge(1 as any, 2)).toBe(1)
  expect(_merge({}, 2)).toEqual({})

  const a1 = {
    b: {
      c: 'c1',
    },
    e: 'e1',
  }
  const a2 = {
    b: {
      c2: 'c2',
    },
    d: 'd2',
  }

  expect(_merge(a1, a2)).toMatchInlineSnapshot(`
    Object {
      "b": Object {
        "c": "c1",
        "c2": "c2",
      },
      "d": "d2",
      "e": "e1",
    }
  `)

  const b1 = {}
  expect(_merge(b1, a2)).toMatchInlineSnapshot(`
    Object {
      "b": Object {
        "c2": "c2",
      },
      "d": "d2",
    }
  `)

  expect(_merge({ a: 'a1', o: { oo: 'oo1' } }, { b: 'b1' }, { o: { z: 'z1' } }, { a: 'a2' }))
    .toMatchInlineSnapshot(`
    Object {
      "a": "a2",
      "b": "b1",
      "o": Object {
        "oo": "oo1",
        "z": "z1",
      },
    }
  `)
})

test('_invert', () => {
  const o = {
    a: 'ak',
    b: 'bk',
  }
  const inv = _invert(o)
  const _v1 = inv['ak'] // typeof _v1 should be `a` | `b` | undefined

  expect(inv).toEqual({
    ak: 'a',
    bk: 'b',
  })
})

test('_invertMap', () => {
  const o = new Map([
    ['a', 'ak'],
    ['b', 'bk'],
  ])
  const inv = new Map([
    ['ak', 'a'],
    ['bk', 'b'],
  ])

  expect(_invertMap(o)).toEqual(inv)
})

test.each([[undefined], [null], [1], [true], ['hello']] as any[])('isPrimitive "%s"', v => {
  expect(_isPrimitive(v)).toBe(true)
})

test.each([[[]], [{}], [() => {}]] as any[])('!isPrimitive "%s"', v => {
  expect(_isPrimitive(v)).toBe(false)
})

test('_get, _has', () => {
  const o = {
    a: 'a',
    b: 'b',
    c: {
      d: '11',
      e: 3,
      f: [null, undefined, 1, '5', 'd'],
    },
  }

  expect(_get(undefined, '')).toBeUndefined()
  expect(_get(undefined, undefined as any)).toBeUndefined()
  expect(_get(o, '')).toBeUndefined()
  expect(_get(o, 'a')).toBe('a')
  expect(_get(o, 'b')).toBe('b')
  expect(_get(o, 'c')).toEqual(o.c)
  expect(_get(o, 'c.d')).toBe('11')
  expect(_get(o, 'c.e')).toBe(3)
  expect(_get(o, 'c.f')).toEqual(o.c.f)
  expect(_get(o, 'c.f[0]')).toBe(null)
  expect(_get(o, 'c.f.0')).toBe(null)
  expect(_get(o, 'c.f[1]')).toBeUndefined()
  expect(_get(o, 'c.f[1]', 'def')).toBe('def')
  expect(_get(o, 'c.f[2]')).toBe(1)
  expect(_get(o, 'c.f[3]')).toBe('5')
  expect(_get(o, 'c.f[4]')).toBe('d')

  // expect(_has(undefined)).toBe(false)
  expect(_has(o)).toBe(false)
  expect(_has(o, 'a')).toBe(true)
  expect(_has(o, 'a.b')).toBe(false)
  expect(_has(o, 'c.d')).toBe(true)
  expect(_has(o, 'c.f')).toBe(true)
  expect(_has(o, 'c.f[0]')).toBe(false)
  expect(_has(o, 'c.f[1]')).toBe(false)
  expect(_has(o, 'c.f[2]')).toBe(true)
  expect(_has(o, 'c.f[6]')).toBe(false)
})

test('_set', () => {
  expect(_set(undefined as any, undefined as any)).toBeUndefined()
  expect(_set({}, undefined as any)).toEqual({})
  expect(_set({}, '')).toEqual({})
  expect(_set({}, '', 'a')).toEqual({})
  expect(_set({}, 'a', 'a1')).toEqual({ a: 'a1' })
  expect(_set({}, 'a.b', 'a1')).toEqual({ a: { b: 'a1' } })
  expect(_set({}, 'a.b[0]', 'a1')).toEqual({ a: { b: ['a1'] } })
  expect(_set({}, 'a.b.0', 'a1')).toEqual({ a: { b: ['a1'] } })
  expect(_set({ a: {} }, 'a.b.0', 'a1')).toEqual({ a: { b: ['a1'] } })
  expect(_set({ a: { b: ['b1'] } }, 'a.b.0', 'a1')).toEqual({ a: { b: ['a1'] } })
  expect(_set({ a: { b: ['b1', 'b2'] } }, 'a.b.0', 'a1')).toEqual({ a: { b: ['a1', 'b2'] } })
  expect(_set({ a: { b: ['b1', 'b2'] } }, 'a.b.1', 'a1')).toEqual({ a: { b: ['b1', 'a1'] } })
})

test('_mapKeys', () => {
  const o = { a: 1, b: 2 }
  deepFreeze(o)
  expect(_mapKeys(o, (k, v) => k + v)).toEqual({ a1: 1, b2: 2 })
})

test('_mapValues', () => {
  const users = {
    fred: { user: 'fred', age: 40 },
    pebbles: { user: 'pebbles', age: 1 },
  }
  deepFreeze(users)
  expect(_mapValues(users, (_k, v) => v)).toEqual(users)
  expect(_mapValues(users, (_k, v) => v.age)).toEqual({ fred: 40, pebbles: 1 })
})

test('_mapObject', () => {
  const o = { b: 2, c: 3, d: 4 }
  deepFreeze(o)

  // Example that inverts keys/values in the object
  const mapped = _mapObject(o, (k, v) => [String(v), k])
  expect(mapped).toEqual({ 2: 'b', 3: 'c', 4: 'd' })
})

test('_findKeyByValue', () => {
  const o = { b: 2, c: 3, d: 4 }
  expect(_findKeyByValue(o, 2)).toBe('b')
  expect(_findKeyByValue(o, 3)).toBe('c')
  expect(_findKeyByValue(o, 4)).toBe('d')
  expect(_findKeyByValue(o, 5)).toBeUndefined()
  expect(_findKeyByValue(o, undefined as any)).toBeUndefined()

  enum CHAR {
    A = 'A',
    B = 'B',
  }

  const map: Record<CHAR, number> = {
    [CHAR.A]: 1,
    [CHAR.B]: 2,
  }

  const char = _findKeyByValue(map, 2)
  // typeof char should be `CHAR | undefined`, not `string | undefined`
  expect(char).toBe(CHAR.B)
})
