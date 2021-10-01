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

## \_stringifyAny

Inspired by `inspectAny` from [nodejs-lib](https://github.com/NaturalCycles/nodejs-lib), which is
based on `util.inpect` that is not available in the Browser.

Transforms `any` to human-readable string (via `JSON.stringify` pretty).

Safe (no error throwing).

Correclty prints `Error`, `AppError`, `ErrorObject`:
`error.message + '\n' + stringifyAny(error.data)`

Enforces max length (default to `1000`, pass `0` to skip it).

Logs numbers as-is (as a String), e.g: `6`.

Logs strings as-is (without single quotes around, unlike default util.inspect behavior).

Otherwise - just uses `JSON.stringify`.

Returns `empty_string` string if empty string is passed.

Returns `undefined` (not a string, but actual `undefined`) if `undefined` is passed (default
`util.inspect` behavior).

```ts
_stringifyAny(undefined) // 'undefined'
_stringifyAny(null) // 'null'
_stringifyAny(true) // 'true'
_stringifyAny(false) // 'false'
_stringifyAny(NaN) // 'null'
_stringifyAny(Infinity) // 'null'
_stringifyAny('') // 'empty_string'
_stringifyAny(' ') // 'empty_string'
_stringifyAny('ho ho ho') // 'ho ho ho'
_stringifyAny(15) // '15'
_stringifyAny(new Error('some msg')) // 'Error: some msg'

// AppError is stringified with it's Data object
_stringifyAny(new AppError('some msg', { k1: 'v1' }))
// 'AppError: some msg\n
// {
//   "k1": "v1"
// }'
```
