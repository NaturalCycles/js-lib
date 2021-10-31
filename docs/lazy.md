# Lazy

## \_lazyValue

Based on: https://github.com/sindresorhus/lazy-value

```ts
const value = lazyValue(() => expensiveComputation())

value() // calls expensiveComputation() once
value() // returns cached result
value() // returns cached result
```

## \_defineLazyProperty

Based on: https://github.com/sindresorhus/define-lazy-prop

```ts
interface Obj {
  v: number
}

const obj = {} as Obj

_defineLazyProperty(obj, 'v', () => expensiveComputation())
obj.v // runs expensiveComputation() once
obj.v // cached value
obj.v // cached value
```
