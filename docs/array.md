# Array

## \_range

Quickly generate an incremental array of numbers.

- Starts with 0, unless specified differently
- Step is 1, unless specified differently
- Lower bound is **inclusive**, higher-bound is **exclusive**.

```ts
_range(3)
// [0, 1, 2]

_range(3, 6)
// [3, 4, 5]

_range(1, 10, 2)
// [1, 3, 5, 7, 9]
```

## \_chunk

Splits an input array into "chunks" of defined size. Last/remaining chunk may be of "incomplete"
size. Returns array-of-arrays.

```ts
const a = [1, 2, 3, 4, 5, 6]

_chunk(a, 2)
// [[1, 2], [3, 4], [5, 6]]

_chunk(a, 3)
// [[1, 2, 3], [4, 5, 6]]

_chunk(a, 4)
// [[1, 2, 3, 4], [5, 6]]]
```

## \_flatten

Polyfill to `Array.flat()` with depth=1. From
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

```ts
_flatten([
  [1, 2],
  [3, 4],
])
// [1, 2, 3, 4]
```

## \_flattenDeep

Based on https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_flattendeep

Recursive `Array.flat()`, with infinite depth.

```ts
_flattenDeep([
  [
    [1, 2],
    [3, 4],
  ],
  [5, 6],
  [7],
])
// [1, 2, 3, 4, 5, 6, 7]
```

## \_uniq

Convenience function to remove duplicates from an array of **primitives**.

```ts
const a = [1, 2, 2, 3]
_uniq(a)
// [1, 2, 3]
```

## \_uniqBy

Remove duplicates from array of objects, providing a comparator function.

```ts
const a = [{ age: 18 }, { age: 20 }, { age: 18 }]
_uniqBy(a, obj => obj.age)
// [{ age: 18 }, { age: 20 }]
```

## \_by

```ts
const a = [
  { id: 'id1', a: 'a1' },
  { id: 'id2', b: 'b1' },
]

_by(a, r => r.id)
// {
//  id1: {id: 'id1', a: 'a1'},
//  id2: {id: 'id2', b: 'b1'},
//}
```

## \_groupBy

```ts
const a = [1, 2, 3, 4, 5]

_groupBy(a, r => (r % 2 ? 'even' : 'odd'))
// {
//  odd: [1, 3, 5],
//  even: [2, 4],
// }
```

Returning `undefined` from the Mapper will EXCLUDE the item.

## \_sortBy

Sort an array of object, providing a comparator function.

```ts
const a = [{ age: 18 }, { age: 20 }, { age: 19 }]
_sortBy(a, obj => obj.age)
// [{ age: 18 }, {age: 19 }, { age: 20 }]
```

## \_sortNumbers

Sort an array of numbers. Needs a special treatment because of a caveat, that a default comparator
function compares things as Strings (even Numbers), so '21' > '100'.

```ts
const a = [1, 3, 2]
_sortNumbers(a)
// [1, 2, 3]
```

## \_findLast

Like `.find()`, but tries to find an element from the END of the array.

```ts
const a = [1, 2, 3, 4, 5]
_findLast(a, n => n % 2 === 0)
// 4
```

## \_takeWhile, \_takeRightWhile, \_dropWhile, \_dropRightWhile

```ts
const a = [1, 2, 3, 4, 5, 2, 1]

_takeWhile(a, r => r <= 3)
// [1, 2, 3]

_takeRightWhile(a, r => r <= 3)
// [1, 2]
// Note that the order is reversed when taking from Right!

_dropWhile(a, r => r <= 3)
// [4, 5, 2, 1]

_dropRightWhile(a, r => r <= 3)
// [5, 4, 3, 2, 1]
// Note that the order is reversed when dropping from Right!
```

## \_countBy

```ts
_countBy(['a', 'aa', 'aaa', 'aaa', 'aaaa'], r => r.length)
// {
//   1: 1,
//   2: 1,
//   3: 2,
//   4: 1,
// })
```

## \_intersection

Inspired by Lodash's [\_.intersection](https://lodash.com/docs/#intersection).

```ts
_intersection([2, 1], [2, 3])
// [2]

_intersection([1], [2])
// []

_intersection()
// []

_intersection([1])
// [1]
```

## \_difference

Inspired by Lodash's [\_.difference](https://lodash.com/docs/#difference)

```ts
_difference([2, 1], [2, 3])
// [1]

_difference([1], [2])
// [1]

_difference([1], [1])
// []

_difference([1])
// [1]
```

## \_mapToObject

Map an array of `T` to a `StringMap<V>`, by returning a tuple of `[key, value]` from a mapper
function.

Return `undefined`/`null`/`false`/`0`/`void` to filter out (not include) a value.

Similar to `reduce`, but with subjectively cleaner syntax of returning "entries".

Similar to mapping to "entries" and passing to `Object.fromEntries()`.

```ts
_mapToObject([1, 2, 3], n => [n, n * 2])
// { '1': 2, '2': 4, '3': 6 }

_mapToObject([1, 2, 3], n => [n, `id${n}`])
// { '1': 'id1, '2': 'id2', '3': 'id3' }
```
