# Number

## \_inRange

Checks if the provided number (1st argument) is withing range of 2nd and 3rd argument. As usual,
lower-bound is inclusive, while higher-boung is exclusive.

```ts
_inRange(-10, 1, 5)
// false

_inRange(1, 1, 5)
// true

_inRange(3, 1, 5)
// true

_inRange(5, 1, 5)
// false

_inRange(7, 1, 5)
// false
```

## \_clamp

Inspired by Lodash's `_clamp`.

"Clamps" (fits) the number (first argument) within the min/max ranges of 2nd/3rd arguments (range
inclusive).

```ts
// range is always [5, 10] in these cases
_clamp(3, 5, 10) // 5
_clamp(4, 5, 10) // 5
_clamp(5, 5, 10) // 5
_clamp(6, 5, 10) // 6
_clamp(9, 5, 10) // 9
_clamp(10, 5, 10) // 10
_clamp(11, 5, 10) // 10
```

## \_toFixed

Same as `Number.toFixed`, but conveniently casts the output to Number.

```ts
_toFixed(1.2345, 2)
// 1.23

_toFixed(1.1, 2)
// 1.1
// not '1.10' !
```

## \_toPrecision

Same as `Number.toPrecision()`, but conveniently casts the output to Number.

```ts
_toPrecision(1634.56, 1)
// 2000

_toPrecision(1234.56, 2)
// 1600
```

## \_round

Round (like `Math.round`) the Number to the nearest "discriminator" (2nd argument):

```ts
_round(1634, 1000) // 2000
_round(1634, 500) // 1500
_round(1634, 100) // 1600
_round(1634, 10) // 1630
_round(1634, 1) // 1634
_round(1634.5678, 0.1) // 1634.6
_round(1634.5678, 0.01) // 1634.57
```
