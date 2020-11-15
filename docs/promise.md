# Promise

Inspired by [bluebird](https://github.com/petkaantonov/bluebird) and Sindre's
[promise-fun](https://github.com/sindresorhus/promise-fun) packages.

"Copy-pasted" (with small adjustments) here, because:

1. Bluebird is outdated (pre-ES6)

2. `p-*` packages are amazing, but not all of them are needed. Some of them are very much needed
   though.

3. To fix issues with Types. Here, everything is TypeScript, so, first class support and sync.

4. To fix issues with IDE auto-imports, which is still quite bad for "default exported" packages.

Downside is that (as every fork) we lose "auto-update" possibility from these packages. We believe
it's not as bad, because packages imported here have mature API and stability (example: pMap).

## pMap

Based on https://github.com/sindresorhus/p-map

## pProps

Based on https://github.com/sindresorhus/p-props

## pFilter

Based on https://github.com/sindresorhus/p-filter

## pDefer

Allows to create a "ResolvablePromise", which is a normal native Promise (so, can be awaited, etc),
extended with `.resolve()` and `.reject()` methods, so you can control it. Similar to jQuery's
Deferred, or RxJS's Subject (which is both an Observable and allows to emit values).

```ts
// todo: example
```

## pRetry

Based on https://github.com/sindresorhus/p-retry

## pDelay

Based on https://github.com/sindresorhus/delay

```ts
// todo: example
```

## pHang

```ts
// todo: example
```

## pState

```ts
// todo: example
```

## pBatch

```ts
// todo: example
```
