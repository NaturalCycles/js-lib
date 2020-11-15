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

## \_filterNullishValues

## \_filterEmptyValues

Filters the object by removing all key-value pairs where Value is Empty (according to \_isEmpty()
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

## \_mapKeys

## \_mapValues

## \_mapObject

## \_objectNullValuesToUndefined

## \_deepCopy

## \_isPrimitive

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

## \_merge

## \_deepTrim

## \_sortObjectDeep

## \_unset

## \_getKeyByValue

## \_invert

## \_invertMap

## \_get

## \_set

## \_has

## \_deepEquals

## \_stringMapValues

Needed due to https://github.com/microsoft/TypeScript/issues/13778  
Only affects typings, no runtime effect.

## \_stringMapEntries

Needed due to https://github.com/microsoft/TypeScript/issues/13778  
Only affects typings, no runtime effect.
