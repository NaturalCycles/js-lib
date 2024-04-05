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

Based on [p-map](https://github.com/sindresorhus/p-map)

Allows to asynchronously map an array of Promises, with options to:

- control `concurrency` (default: `16`)
- control error behavior (`ErrorMode`):
  - `THROW_IMMEDIATELY` (default)
  - `THROW_AGGREGATED`: throw `AggregateError` in the end of execution, if at least 1 error happened
  - `SUPPRESS`: completely suppress (ignore) errors

```ts
const promises = [
   fetch(...),
   fetch(...),
   fetch(...),
]
const results = await pMap(promises, async r => { ... }, {
  concurrency: 2,
  errorMode: ErrorMode.SUPPRESS,
})
```

## pProps

Based on [p-props](https://github.com/sindresorhus/p-props)

Syntax-sugar to concurrently execute multiple promises and map their results to named properties.

Before:

```ts
const [r1, r2, r3] = await Promise.all([
  fetch(...),
  fetch(...),
  fetch(...),
])
```

After:

```ts
const {r1, r2, r3} = await pProps({
  r1: fetch(...),
  r2: fetch(...),
  r3: fetch(...),
})
```

## pFilter

Based on [p-filter](https://github.com/sindresorhus/p-filter)

Allows to asynchrously filter an array of Promises.

```ts
const promises = [
   fetch(...),
   fetch(...),
   fetch(...),
]

const results = await pFilter(promises, async r => (await r.json()).success)
```

## pDefer

Allows to create a "ResolvablePromise", which is a normal native Promise (so, can be awaited, etc),
extended with `.resolve()` and `.reject()` methods, so you can control it. Similar to jQuery's
Deferred, or RxJS's Subject (which is both an Observable and allows to emit values).

Sometimes useful to "promisify" a callback-style API.

```ts
async function run(): Promise<string> {
  const defer = pDefer<string>()

  someOldApi(
    (result: string) => {
      defer.resolve(result)
    },
    err => defer.reject(err),
  )

  return await defer.promise
}
```

## pDelay

Based on [p-delay](https://github.com/sindresorhus/delay)

Just a fancy async/await style `setTimeout`

Before:

```ts
await new Promise(resolve => setTimeout(resolve, 500))
```

After:

```ts
await pDelay(500)
```

Allows to return a value:

```ts
const res = await pDelay(500, 'hello')
// hello
```

## pRetry

Based on [p-retry](https://github.com/sindresorhus/p-retry)

Returns a `Function` (!), enhanced with retry capabilities.

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

## pTimeoutFn

Based on [p-timeout](https://github.com/sindresorhus/p-timeout)

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

Syntax-sugar for returning a never-resolving ("hung") Promise.

Has semantic meaning, telling us that this Promise is meant to never get resolved or rejected.

Before:

```ts
return new Promise()
```

After:

```ts
return pHang()
```

Useful e.g when you do `location.reload()` (let's say, you want to reload the page after being
logged-in as an Admin) and want your BlockingLoader to never stop spinning:

```ts
async function adminLogin(): Promise<void> {
  location.href = '/admin'
  return pHang()
}
```

## pState

Returns Promise's "state" as a String, one of:

- `pending`
- `resolved`
- `rejected`

```ts
const p = new Promise()
await pState(p)
// 'pending'

const p = new Promise.resolve()
await pState(p)
// 'resolved'
```
