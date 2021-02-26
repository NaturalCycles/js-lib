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

## pDelay

Based on https://github.com/sindresorhus/delay

```ts
// todo: example
```

## pRetry

Based on https://github.com/sindresorhus/p-retry

Returns a Function (!), enhanced with retry capabilities.

Simplest example:

```ts
const save = pRetry(async () => await dao.save())

await save()
// will retry 3 times, with default delay of 1 second and exponential back-off (x2 delay multiplier)
```

Advanced example (with options):

```ts
const save = pRetry(async () => await dao.save(), {
  maxAttempts: 5,
  predicate: err => err?.message.includes('GOAWAY'),
})

await save()
// will try up to 5 times, but only if err.message contains GOAWAY
```

## pTimeout

Based on https://github.com/sindresorhus/p-timeout

Decorates a Function with a timeout.

Throws an Error if the Function is not resolved in a certain time.

If the Function rejects - passes this rejection further.

```ts
const decoratedFn = pTimeout(someFunction, { timeout: 1000 })

await decoratedFn()
// will throw Timeout error if `someFunction` is not finished in 1000 ms.
// otherwise will pass
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
