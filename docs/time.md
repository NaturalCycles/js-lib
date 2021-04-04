# Time

## \_ms

Prints a human-string for a given number of milliseconds.

```ts
_ms(1) // '1 ms'
_ms(10) // '10 ms'
_ms(1005) // '1.005 sec'
_ms(49123) // '49 sec'
_ms(60000) // '1m0s'
_ms(60912) // '1m0s'
_ms(69123) // '1m9s'
_ms(3292100) // '54m52s'
_ms(69642430) // '19h20m'
_ms(101963481) // '28h'
```

## \_since

Useful to measure and human-print the "time elapsed since".

```ts
const started = Date.now()

// ... do stuff!

console.log(`Took ${_since(started)}`)
// Took 19m13s
```

Uses `_ms` for pretty-printing.

## \_debounce

Debounce function from Lodash.

See the typescript declaration for Options.

```ts
const fn = _debounce(originalFn, 100, { leading: false, trailing: false, maxWait: 300 })
```

## \_throttle

Throttle function from Lodash.

See the typescript declaration for Options.

```ts
const fn = _throttle(originalFn, 100)
```
