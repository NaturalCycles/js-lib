# Types

Things that should exist in [type-fest](https://github.com/sindresorhus/type-fest), but don't (yet).

## StringMap

```ts
const m: StringMap = { a: 'a' }
// Same as:
// const m: { [a: string]: string | undefined }

const m: StringMap<number> = { a: 5 }
// Same as:
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
