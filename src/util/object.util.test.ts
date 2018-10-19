import { deepFreeze } from '../testing/test.shared.util'
import { objectUtil } from './object.util'

test('pick', () => {
  const f = objectUtil.pick.bind(objectUtil)

  expect(f(undefined)).toBe(undefined)
  expect(f(null)).toBe(null)
  expect(f({})).toEqual({})

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: false,
  }

  expect(f(obj)).toEqual(obj) // no fields

  const fields: string[] = ['a', 'c', 'd', 'e']
  const r = f(obj, fields)
  // console.log(r)
  expect(r).toEqual({ a: 1, c: 3, d: false })
  expect('e' in r).toBe(false) // should not add more fields with 'undefined' value
  // should not mutate
  expect(obj.c).toBe(3)
})

test('deepTrim', () => {
  const f = objectUtil.deepTrim.bind(objectUtil)
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
    objectUtil.deepTrim({
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
  const f = objectUtil.filterFalsyValues.bind(objectUtil)
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
  const f = objectUtil.filterEmptyStringValues.bind(objectUtil)
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

  expect(objectUtil.filterUndefinedValues(o)).toEqual({
    a: 1,
    b: 0,
    e: '',
    f: 'wer',
  })
})

test('filterValues', () => {
  const f = objectUtil.filterValues.bind(objectUtil)
  const br = {
    a: 'b',
    c: null,
  }

  // should mutate
  f(br, (k: any, v: any) => v !== null, true)
  expect(br.c).toBeUndefined()
})

test('objectNullValuesToUndefined', () => {
  const o = {
    a: undefined,
    b: null,
    c: 1,
  }
  expect(objectUtil.objectNullValuesToUndefined(o)).toEqual({
    a: undefined,
    b: undefined,
    c: 1,
  })
})

test('deepEquals Issue!', () => {
  expect(
    objectUtil.deepEquals(
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
    objectUtil.deepEquals(
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
    objectUtil.deepEquals(
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
  const o = {
    a: 1,
    b: {
      c: 3,
      d: 4,
    },
    m: 5,
  }
  objectUtil.unsetValue(o, 'b.c')
  objectUtil.unsetValue(o, 'm')
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
  expect(objectUtil.deepCopy(o)).toEqual(o)
})

test('isObject', () => {
  expect(objectUtil.isObject(undefined)).toBe(false)
})

test('isEmptyObject', () => {
  const a = [1, 0, -1, undefined, null, 'wer', 'a', '', {}, { a: 'b' }]

  const empty = a.filter(i => objectUtil.isEmptyObject(i))
  expect(empty).toEqual([{}])
})

test('mergeDeep', () => {
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

  expect(objectUtil.mergeDeep(a1, a2)).toMatchSnapshot()
})

test('mask', () => {
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
  const r = objectUtil.mask(o, ['b.c'])
  expect(r).toEqual({
    a: '1',
    b: {
      d: '1',
      e: {
        f: 7,
      },
    },
  })
  expect(r.b.c).toBeUndefined()
  expect(r.b.e !== o.b.e)

  // should not fail
  expect(objectUtil.mask(o, ['c.0.0'])).toEqual(o)
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

  // console.log(objectUtil.sortObjectDeep(o))
  expect(objectUtil.sortObjectDeep(o)).toMatchSnapshot()
})

test('arrayToHash', () => {
  const f = objectUtil.arrayToHash

  expect(f(undefined)).toEqual({})
  expect(f([])).toEqual({})

  const a = ['a', 'b']
  expect(f(a)).toEqual({
    a: true,
    b: true,
  })
})

test('classToPlain', () => {
  const f = objectUtil.classToPlain

  class A {
    constructor (public a?: string, public b?: string) {}
  }

  expect(f(undefined)).toEqual({})
  expect(f(null)).toEqual(null)
  expect(f({})).toEqual({})
  expect(f(new A('aa', 'bb'))).toEqual({ a: 'aa', b: 'bb' })
})

test('getKeyByValue', async () => {
  const o = {
    a: 'ak',
    b: 'bk',
  }
  expect(objectUtil.getKeyByValue(o, 'bk')).toBe('b')
  expect(objectUtil.getKeyByValue(o, 'ak')).toBe('a')
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

  expect(objectUtil.invertObject(o)).toEqual(inv)
})

test('invertMap', async () => {
  const o = new Map([['a', 'ak'], ['b', 'bk']])
  const inv = new Map([['ak', 'a'], ['bk', 'b']])

  expect(objectUtil.invertMap(o)).toEqual(inv)
})

test('by', () => {
  expect(objectUtil.by(undefined, 'a')).toEqual({})

  const a = [{ a: 'aa' }, { a: 'ab' }, { b: 'bb' }]
  const r = objectUtil.by(a, 'a')
  expect(r).toEqual({
    aa: { a: 'aa' },
    ab: { a: 'ab' },
  })
})
