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
