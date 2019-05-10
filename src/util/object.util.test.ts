import {
  by,
  deepCopy,
  deepEquals,
  deepFreeze,
  deepTrim,
  filterEmptyStringValues,
  filterFalsyValues,
  filterObject,
  filterUndefinedValues,
  getKeyByValue,
  invertMap,
  invertObject,
  isEmptyObject,
  isObject,
  isPrimitive,
  mask,
  mergeDeep,
  objectNullValuesToUndefined,
  omit,
  pick,
  sortObjectDeep,
  transformValues,
  unsetValue,
} from './object.util'

test('pick', () => {
  const f = pick

  expect(f(undefined as any)).toBe(undefined)
  expect(f(null as any)).toBe(null)
  expect(f({})).toEqual({})

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
  }

  expect(f(obj)).toEqual(obj) // no fields

  const fields = ['a', 'c', 'd', 'e'] as const
  const r = f(obj, fields as any)
  // console.log(r)
  expect(r).toEqual({ a: 1, c: 3, d: false })
  expect('e' in r).toBe(false) // should not add more fields with 'undefined' value
  // should not mutate
  expect(obj.c).toBe(3)
})

test('omit', () => {
  expect(omit(undefined as any)).toBe(undefined)
  expect(omit(null as any)).toBe(null)
  expect(omit({})).toEqual({})

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
    e: undefined,
  }

  deepFreeze(obj)

  expect(omit(obj)).toEqual(obj)

  expect(omit(obj, ['b', 'c'])).toEqual({
    a: 1,
    d: false,
    e: undefined,
  })

  expect(omit(obj, ['a', 'd', 'e'])).toEqual({
    b: 2,
    c: 3,
  })
})

test('mask shallowCopy', () => {
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
  const r = mask(o, ['b.c'])
  expect(r).toMatchSnapshot()
  expect(r.b).toEqual(o.b) // cause it will mutate r.b
})

test('mask deepCopy', () => {
  const o = {
    a: '1',
    b: {
      c: '2',
      d: '1',
    },
  }
  deepFreeze(o)
  const r = mask(o, ['b.c'], true)
  expect(r).toMatchSnapshot()

  // should not fail
  expect(mask(o, ['c.0.0'])).toEqual(o)
})

test('deepTrim', () => {
  const f = deepTrim
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

  expect(f(undefined)).toBe(undefined)

  expect(
    deepTrim({
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

test('filterFalsyValues', () => {
  const f = filterFalsyValues
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

test('filterEmptyStringValues', () => {
  const f = filterEmptyStringValues
  const o = {
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    e: '',
    f: 'wer',
  }
  expect(f(o)).toEqual({
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    f: 'wer',
  })
  // should NOT mutate
  expect(o.e).toBe('')

  // should mutate if needed
  f(o, true)
  expect(o.e).toBe(undefined)
})

test('filterUndefinedValues', () => {
  const o = {
    a: 1,
    b: 0,
    c: undefined,
    d: null,
    e: '',
    f: 'wer',
  }
  deepFreeze(o)

  expect(filterUndefinedValues(o)).toEqual({
    a: 1,
    b: 0,
    e: '',
    f: 'wer',
  })
})

test('filterObject', () => {
  expect(filterObject(1, () => false)).toBe(1)

  const f = filterObject
  const br = {
    a: 'b',
    c: null,
  }

  // should mutate
  f(br, (k: any, v: any) => v !== null, true)
  expect(br.c).toBeUndefined()
})

test('transformValues', () => {
  expect(transformValues(1, () => {})).toBe(1)
})

test('objectNullValuesToUndefined', () => {
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

  expect(objectNullValuesToUndefined(o)).toEqual(o2)

  // mutate
  objectNullValuesToUndefined(o, true)
  expect(o).toEqual(o2)
})

test('deepEquals Issue!', () => {
  expect(
    deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        b: 2,
        a: 1,
      },
    ),
  ).toBe(true)
})

test('deepEquals', () => {
  expect(
    deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        a: 1,
        b: 2,
      },
    ),
  ).toBe(true)

  expect(
    deepEquals(
      {
        a: 1,
        b: 2,
      },
      {
        a: 1,
        b: 2,
        c: 3,
      },
    ),
  ).toBe(false)
})

test('unsetValue', () => {
  expect(unsetValue(1, 'a')).toBeUndefined()

  const o = {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
    m: 5,
  }
  unsetValue(o, 'b.c')
  unsetValue(o, 'm')
  expect(o).toEqual({
    a: 1,
    b: {
      d: 4,
    },
  })
  expect(o.m).toBeUndefined()
  expect(o.b.c).toBeUndefined()
})

test('deepCopy', () => {
  const o = {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
  }
  expect(deepCopy(o)).toEqual(o)
})

test('isObject', () => {
  expect(isObject(undefined)).toBe(false)
})

test('isEmptyObject', () => {
  const a = [1, 0, -1, undefined, null, 'wer', 'a', '', {}, { a: 'b' }]

  const empty = a.filter(i => isEmptyObject(i))
  expect(empty).toEqual([{}])
})

test('mergeDeep', () => {
  expect(mergeDeep(1, 2)).toBe(1)
  expect(mergeDeep({}, 2)).toEqual({})

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

  expect(mergeDeep(a1, a2)).toMatchSnapshot()

  const b1 = {}
  expect(mergeDeep(b1, a2)).toMatchSnapshot()
})

test('sortObjectDeep', () => {
  const o = {
    b: 2,
    a: 1,
    c: {
      d: {
        m: 4,
        j: 5,
        aa: 1,
      },
      m: 'sdf',
      dd: [3, 2, 1, 0, 55],
      ddd: ['b', 'c', 'a'],
    },
    aa: 6,
  }

  // console.log(sortObjectDeep(o))
  expect(sortObjectDeep(o)).toMatchSnapshot()
})

test('getKeyByValue', async () => {
  expect(getKeyByValue(undefined, 'v')).toBeUndefined()
  expect(getKeyByValue(1, 'v')).toBeUndefined()

  const o = {
    a: 'ak',
    b: 'bk',
  }
  expect(getKeyByValue(o, 'bk')).toBe('b')
  expect(getKeyByValue(o, 'ak')).toBe('a')
})

test('invertObject', async () => {
  const o = {
    a: 'ak',
    b: 'bk',
  }
  const inv = {
    ak: 'a',
    bk: 'b',
  }

  expect(invertObject(o)).toEqual(inv)
})

test('invertMap', async () => {
  const o = new Map([['a', 'ak'], ['b', 'bk']])
  const inv = new Map([['ak', 'a'], ['bk', 'b']])

  expect(invertMap(o)).toEqual(inv)
})

test('by', () => {
  expect(by(undefined, 'a')).toEqual({})

  const a = [{ a: 'aa' }, { a: 'ab' }, { b: 'bb' }]
  const r = by(a, 'a')
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })
})

test('deepFreeze', () => {
  const o = {
    a: {
      b: 'bb',
    },
  }
  deepFreeze(o)
  expect(() => (o.a = 'cc' as any)).toThrow()
  expect(() => (o.a.b = 'cc')).toThrow()
})

test.each([[undefined], [null], [1], [true], ['hello']] as any[])('isPrimitive "%s"', v => {
  expect(isPrimitive(v)).toBe(true)
})

test.each([[[]], [{}], [() => {}]] as any[])('!isPrimitive "%s"', v => {
  expect(isPrimitive(v)).toBe(false)
})
