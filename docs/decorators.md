# Decorators

## @\_Debounce

## @\_Throttle

## @\_LogMethod

## @\_Memo

## @\_Retry

## @\_Timeout

Decoratod method will throw TimeoutError if it hasn't finished in given time.

```ts
class C {
  @_Timeout({ timeout: 1000 })
  async hello() {
    // some logic
  }
}

const c = new C()
await c.hello()
// will throw if not finished in 1000 ms
```
