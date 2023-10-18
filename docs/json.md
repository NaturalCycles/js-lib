# Json

## \_jsonParseIfPossible

Attempts to parse object as JSON.

Returns original object if JSON parse failed (silently).

```ts
_jsonParseIfPossible('abc') // 'abc' (no change, not a json string)
_jsonParseIfPossible(null) // null (no change)
_jsonParseIfPossible({ a: 'a' }) // {a: 'a'} (same object, not a json string)
_jsonParseIfPossible('{"a": "a"}') // {a: 'a'} gotcha! parsed json string into an object!
```

## \_stringify

Inspired by `_inspect` from [nodejs-lib](https://github.com/NaturalCycles/nodejs-lib), which is
based on `util.inpect` that is not available in the Browser.

Transforms `any` to human-readable string (via `JSON.stringify` pretty).

Safe (no error throwing).

Correclty prints `Error`, `AppError`, `ErrorObject`: `error.message + '\n' + _stringify(error.data)`

Enforces max length (default to `1000`, pass `0` to skip it).

Logs numbers as-is (as a String), e.g: `6`.

Logs strings as-is (without single quotes around, unlike default util.inspect behavior).

Otherwise - just uses `JSON.stringify`.

Returns `empty_string` string if empty string is passed.

Returns `undefined` (not a string, but actual `undefined`) if `undefined` is passed (default
`util.inspect` behavior).

```ts
_stringify(undefined) // 'undefined'
_stringify(null) // 'null'
_stringify(true) // 'true'
_stringify(false) // 'false'
_stringify(NaN) // 'null'
_stringify(Infinity) // 'null'
_stringify('') // 'empty_string'
_stringify(' ') // 'empty_string'
_stringify('ho ho ho') // 'ho ho ho'
_stringify(15) // '15'
_stringify(new Error('some msg')) // 'Error: some msg'

// AppError is stringified with it's Data object
_stringify(new AppError('some msg', { k1: 'v1' }))
// 'AppError: some msg\n
// {
//   "k1": "v1"
// }'
```
