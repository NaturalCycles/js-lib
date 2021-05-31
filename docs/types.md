# Types

Things that should exist in [type-fest](https://github.com/sindresorhus/type-fest), but don't (yet).

Some types are copy-pasted from `type-fest`, because:

1. To not introduce (another) dependency of this 0-dep lib
2. To avoid multiple `type-fest` versions conflicts (that happened many times in the past)

## StringMap

```ts
const m: StringMap = { a: 'a' }
// Same as:
// const m: { [a: string]: string }
// With `noUncheckedIndexedAccess: true` in `tsconfig` (it's on by default in `dev-lib`) it becomes:
// const m: { [a: string]: string | undefined }

const m: StringMap<number> = { a: 5 }
// Same as:
// const m: { [a: string]: number }
// With `noUncheckedIndexedAccess: true`:
// const m: { [a: string]: number | undefined }
```

## Mapper

```ts
export type Mapper<IN = any, OUT = any> = (input: IN, index: number) => OUT
```

## AsyncMapper

```ts
export type AsyncMapper<IN = any, OUT = any> = (input: IN, index: number) => OUT | PromiseLike<OUT>
```

## Predicate

```ts
export type Predicate<T> = (item: T, index: number) => boolean
```

## Async Predicate

```ts
export type AsyncPredicate<T> = (item: T, index: number) => boolean | PromiseLike<boolean>
```

## \_passthroughPredicate

Predicate that passes everything (returns `true` for every item).

```ts
_passthroughPredicate(anything) // true
  [(1, 2, 3)].filter(_passthroughPredicate)
// [1, 2, 3]
```

## \_passNothingPredicate

Predicate that passes nothing (returns `false` for every item).

```ts
_passNothingPredicate(anything) // false
  [(1, 2, 3)].filter(_passNothingPredicate)
// []
```

## \_noop

Function that takes any arguments and returns `undefined`. Literally does nothing.

Can be useful to replace some real world functions with mocks.

```ts
element.click = _noop
```

## Merge

## ReadonlyDeep

## Promisable

## PromiseValue
