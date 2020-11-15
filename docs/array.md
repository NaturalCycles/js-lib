# Array

## \_range

## \_chunk

## \_flatten

## \_flattenDeep

## \_uniq

## \_uniqBy

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

## \_sortNumbers

## \_toFixed

## \_toPrecision

## \_round

## \_findLast

Like `.find()`, but tries to find an element from the END of the array.

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
