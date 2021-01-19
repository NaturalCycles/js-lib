# Math

## \_randomInt

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

## \_median

## \_percentile

## SimpleMovingAverage
