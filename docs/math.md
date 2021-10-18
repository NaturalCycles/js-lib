# Math

## \_randomInt

Returns a random integer in the provided range. ~~As usual, lower-bound is inclusing, while
higher-bound is exclusive.~~ Unusually, both lower and higher bounds are inclusive.

```ts
_randomInt(1, 3)
// 1
// 3
// 2
```

## \_randomArrayItem

Returns a random item from the given array.

Don't use it on empty array. It'll return `undefined` in that case, but that is not reflected in
function's output type!

```ts
const a = [1, 2, 3]
_randomArrayItem(a)
// random of 1, 2 or 3
```

## \_createDeterministicRandom

Returns a "deterministic Math.random() function".

Useful to make tests that need to use `Math.random()` deterministic.

```ts
const deterministicRandom = _createDeterministicRandom()

deterministicRandom()
// => 0.9872818551957607

deterministicRandom()
// => 0.34880331158638
```

Based on [this gist](https://gist.github.com/mathiasbynens/5670917) which is based on _Robert
Jenkins’ 32 bit integer hash function_.

## \_average

Calculate an average of the array of numbers.

```ts
_average([1, 2, 3, 4])
// 2.5
```

## \_averageWeighted

Calculate a "weighted average", given the array of numbers and corresponding array of weights.

```ts
const numbers = [1, 2]
const weights = [3, 1]
_averageWeighted(numbers, weights)
// 1.25
```

## \_median

Calculate a Median of the array of numbers.

```ts
_median([1, 2, 3]) // 2
_median([1, 2, 3, 4]) // 2.5
_median([1, 1, 1, 3, 999]) // 1
```

## \_percentile

Calculate a Percentile of the array of numbers.

```ts
const numbers = [1200, 1400]
_percentile(numbers, 0) // 1200
_percentile(numbers, 10) // 1220
_percentile(numbers, 20) // 1240
_percentile(numbers, 30) // 1260
_percentile(numbers, 40) // 1280
_percentile(numbers, 50) // 1300
_percentile(numbers, 60) // 1320
_percentile(numbers, 70) // 1340
_percentile(numbers, 80) // 1360
_percentile(numbers, 90) // 1380
_percentile(numbers, 100) // 1400
```

## SimpleMovingAverage

```ts
// SMA with the size of 2:
const sma = new SimpleMovingAverage(2)
sma.avg // 0 by default, when no numbers were pushed

sma.push(1) // [1]
sma.avg // 1

sma.push(2) // [1, 2]
sma.avg // 1.5

sma.push(3) // [1, 2, 3]
sma.avg // 2.5
```
