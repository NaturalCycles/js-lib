# Object

## \_pick

Inspired by Lodash's [\_.pick](https://lodash.com/docs/#pick).

```ts
_pick({ a: 'a', b: 'b', c: 'c' }, ['a', 'b'])
// { a: 'a', b: 'b' }

_pick({ a: 'a', b: 'b', c: 'c' }, ['a'])
// { a: 'a' }

_pick({ a: 'a', b: 'b', c: 'c' }, ['d'])
// {}

_pick({ a: 'a', b: 'b', c: 'c' }, [])
// {}

// Supports "mutation flag" which would mutate the object and return it (same object):
const obj = { a: 'a', b: 'b', c: 'c' }
const obj2 = _pick(obj, ['a'], true)
obj === obj2 // true
```

## \_omit

Inspired by Lodash's [\_.omit](https://lodash.com/docs/#omit). The opposite of `_pick`.

```ts
_omit({ a: 'a', b: 'b', c: 'c' }, ['a', 'b'])
// { c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, ['a'])
// {  b: 'b', c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, ['d'])
// { a: 'a', b: 'b', c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, [])
// { a: 'a', b: 'b', c: 'c' }

// Supports "mutation flag" which would mutate the object and return it (same object):
const obj = { a: 'a', b: 'b', c: 'c' }
const obj2 = _omit(obj, ['a', 'b'], true)
obj === obj2 // true
```

## \_mask

Similar to `_omit`, but supports deep object access via dot-notation (`a.b`). Supports "mutation
flag" argument.

```ts
const obj = {
  a: 'a',
  b: {
    b1: 'b1',
    b2: 'b2',
  },
}

_mask(obj, ['b.b1'])
// { a: 'a', b: { b1: 'b1' }}

_mask(obj, ['b.b1'], true)
// obj was mutated
```

## \_filterFalsyValues

Returns an object with all Falsy values filtered out. Non-mutating by default.

```ts
_filterFalsyValues({
  a: 'a',
  b: '', // falsy
  c: 0, // falsy
  d: [], // not falsy
})
// { a: 'a', d: [] }
```

## \_filterNullishValues

Returns an object with all Nullish (`null` or `undefined`) values filtered out. Non-mutating by
default.

```ts
_filterNullishValues({
  a: 'a',
  b: null, // nullish
  c: undefined, // nullish
  d: '', // not nullish
})
// { a: 'a', d: '' }
```

## \_filterEmptyValues

Filters the object by removing all key-value pairs where Value is Empty (according to `_isEmpty()`
specification).

```ts
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
})
// {
//   a: 0,
//   e: {
//     f: [],
//   },
//   h: 'h',
//  })
```

## \_filterObject

Returns clone of `obj` without properties that does not pass `predicate`. Allows filtering by both
key and value.

```ts
const obj = {
  a: 1,
  b: 2,
  c: 3,
}

// Predicate to keep only even-numbered values
_filterObject(obj, (_k, v) => v % 2 === 0)
// { b: 2 }

// Predicate to only keep keys that start with `a`
_filterObject(obj, (k, _v) => k.startsWith('a'))
// { a: 1 }
```

## \_mapKeys

Returns a clone of `obj` with modified Keys, based on a Mapper function.

```ts
const obj = {
  a: 1,
  b: 2,
  c: 3,
}

// Mapper to add `_odd` or `_even` to the object key, based on its value
_mapKeys(obj, (k, v) => k + (v % 2 ? '_odd' : '_even'))
// { a_odd: 1, b_even: 2, c_odd: 3 }
```

## \_mapValues

Returns a clone of `obj` with modified Values, based on a Mapper function.

```ts
const obj = {
  a: 1,
  b: 2,
  c: 3,
}

// Mapper to multiply object values by 2
_mapValues(obj, (_k, v) => v * 2)
// { a: 2, b: 4, c: 6 }
```

## \_mapObject

Returns a clone of `obj` where both Keys and Values can be modified by a Mapper function. Mapper
function needs to return a Tuple `[key, value]`.

```ts
const obj = {
  a: 1,
  b: 2,
  c: 3,
}

// Mapper to multiply object values by 2, and append the value to the end of the key
_mapObject(obj, (k, v) => {
  const newValue = v * 2
  return [k + newValue, newValue]
})
// { a2: 2, b4: 4, c6: 6 }
```

## \_objectNullValuesToUndefined

Returns a clone of the object where `null` values are replaced with `undefined`

```ts
const obj = {
  a: 1, // intact
  b: null, // replaced with `undefined`
  c: undefined, // intact
}

_objectNullValuesToUndefined(obj)
// { a: 1, b: undefined, c: undefined }
```

## \_deepCopy

Does a deep copy of an object.

Actually, it is just a semantic function that internally does `JSON.parse(JSON.stringify(o))`, which
is currently the fastest+simplest+relyable way to do a deep copy.

Because it does `JSON.parse/stringify` - it'll remove `undefined` values/keys from objects.

```ts
const obj = { a: 'a', b: { bb: 'bb' } }
const obj2 = _deepCopy(obj)
// Deep copy of obj
```

## \_isPrimitive

Returns Boolean indication if passed value is a primitive.

```ts
_isPrimitive(5)
// true

_isPrimitive({ a: 'a' })
// false
```

Best specification is the source code:

```ts
export function _isPrimitive(v: any): v is null | undefined | number | boolean | string {
  return (
    v === null ||
    v === undefined ||
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'string'
  )
}
```

## \_isEmpty

Object is considered empty if it's one of:

- `undefined`
- `''` (empty string)
- `[]` (empty array)
- `{}` (empty object)
- `new Map()` (empty Map)
- `new Set()` (empty Set)

## \_undefinedIfEmpty

Returns `undefined` if it's empty (according to `_isEmpty()` specification), otherwise returns the
original object.

```ts
_undefinedIfEmpty('') // undefined, because it's empty
_undefinedIfEmpty([]) // undefined, because it's empty
_undefinedIfEmpty(new Map()) // undefined, because it's empty
_undefinedIfEmpty('a') // 'a', intact
_undefinedIfEmpty(false) // false, intact
```

## \_merge

Deeply merges the second object into the first one. Returns the first object (merged). Mutates the
first object!

```ts
const obj1 = {
  a: 'a',
  b: {
    bb1: 'bb1',
  },
}

const obj2 = {
  b: {
    bb2: 'bb2',
  },
  c: 'c',
}

_merge(obj1, obj2)
// {
//   a: 'a',
//   b: {
//     bb1: 'bb1',
//     bb2: 'bb2',
//   },
//   c: 'c',
// }
```

## \_deepTrim

Deeply traverses the object and trims all String values found.

```ts
const o = {
  a: 'abc ',
  b: 'c',
  d: 12,
  e: {
    f: '  sd a ',
  },
}

_deepTrim(o)
// {
//   a: 'abc',
//   b: 'c',
//   d: 12,
//   e: {
//     f: 'sd a',
//   },
// }
```

## \_sortObjectDeep

Based on [IndigoUnited/js-deep-sort-object](https://github.com/IndigoUnited/js-deep-sort-object).

Deeply traverses the object and makes it "sort-stable" (deterministic). Useful for e.g
snapshot-testing, or in any place where sort-stable result is expected. Resulting object is still
Equal to the original object.

- Arrays are ~~sorted~~ order-preserved (!), because array order has a meaning and shouldn't be
  changed (!).
- Objects are sorted by their key name.

```ts
const obj = {
  b: 'b',
  c: ['c3', 'c1', 'c2'],
  a: 'a',
}

_sortObjectDeep(obj)
// {
//   a: 'a',
//   b: 'b',
//   c: ['c1', 'c2', 'c3'],
// }
```

## \_deepEquals

Based on [epoberezkin/fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal/).

Performance-optimized function to check if objects (values) are deeply-equal to each other.

```ts
const obj1 = {
  a: 'a',
  b: {
    bb: 'bb',
  },
}

// Different key order, but still equals
const obj2 = {
  b: {
    bb: 'bb',
  },
  a: 'a',
}

const obj3 = {
  a: 'a',
  b: {
    bb: 'bb3', // not equal!
  },
}

_deepEquals(obj1, obj2) // true
_deepEquals(obj1, obj3) // false
_deepEquals(obj2, obj3) // false
```

## \_getKeyByValue

As the name says - it tries to find and return the key that matches provided value.

```ts
const obj = {
  a: '1',
  b: '2',
  // ...
}

_getKeyByValue(obj, '2') // 'b'
_getKeyByValue(obj, '-1') // undefined, cause not found
```

## \_invert

Returns an Object with "inverted" keys and values.

```ts
const obj = {
  a: '1',
  b: '2',
}

_invert(obj)
// {
//   '1': 'a',
//   '2': 'b',
// }
```

## \_invertMap

Returns a Map with "inverted" keys and values.

```ts
const map = new Map<string, number>([
  ['a', 1],
  ['b', 2],
])

_invertMap(map)
// Map
//   1 => 'a'
//   2 => 'b'
```

## \_get, \_has, \_set, \_unset

Gets the object value via the famous "dot-notation":

```ts
const obj = {
  a: 'a',
  b: {
    bb: 'bb',
  },
}

_get(obj, 'b.bb') // 'bb'
_has(obj, 'b.bb') // true
_has(obj, 'b.bb2') // false
_set(obj, 'b.bb2', 'bb2value') // sets obj.b.bb2 to 'bb2Value'
_unset(obj, 'b.bb') // deletes obj.b.bb
```

## \_stringMapValues

Needed due to https://github.com/microsoft/TypeScript/issues/13778  
Only affects typings, no runtime effect.

```ts
const map: StringMap = {
  a: 'a',
  b: 'b',
}
```

Before:

```ts
const values = Object.values(map)
// values: (string | undefined)[]
```

After:

```ts
const values = _stringMapValues(map)
// values: string[]
```

## \_stringMapEntries

Needed due to https://github.com/microsoft/TypeScript/issues/13778  
Only affects typings, no runtime effect.

```ts
const map: StringMap = {
  a: 'a',
  b: 'b',
}
```

Before:

```ts
const entries = Object.entries(map)
// entries: [string, string | undefined][]
```

After:

```ts
const entries = _stringMapEntries(map)
// entries: [string, string][]
```
