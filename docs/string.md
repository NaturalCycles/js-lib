# String

## \_capitalize

Capitalizes first char, lowercases the rest of the string.

```ts
_capitalize('hello') // Hello
_capitalize('HELLO') // HELLO (no change)
_capitalize('hello world') // Hello world
```

## \_upperFirst

Uppercases first char.

```ts
_upperFirst('hello') // Hello
_upperFirst('HELLO') // HELLO (no change)
_upperFirst('hELLO') // HELLO
```

## \_lowerFirst

Lowercases first char.

```ts
_lowerFirst('Hello') // hello
_lowerFirst('hello') // hello (no change)
_lowerFirst('HELLO') // hELLO
```

## \_camelCase 🐪

Transforms the input string to `camelCase` 🐪. Implementation adapted from Lodash.

```ts
_camelCase('la la la')
_camelCase('la_la_la')
_camelCase('la-la-la')
// laLaLa
```

## \_snakeCase 🐍

Transforms the input string to `snake_case` 🐍. Implementation adapted from Lodash.

```ts
_snakeCase('la la la')
_snakeCase('la-la-la')
_snakeCase('laLaLa')
// la_la_la
```

## \_kebabCase 🥙

Transforms the input string to `kebab-case` 🥙. Implementation adapted from Lodash.

```ts
_kebabCase('la la la')
_kebabCase('la_la_la')
_kebabCase('laLaLa')
// la-la-la
```

## \_split

Like `String.split`, but with the limited number of tokens.

```ts
_split('a_b_c', '_', 2)
// ['a', 'b_c']
```

## \_substringBefore

```ts
_substringBefore('file1.test.ts', '.')
// 'file1'

_substringBefore('file1.test.ts', '.ts')
// 'file1.test'
```

## \_substringBeforeLast

```ts
_substringBeforeLast('file1.test.ts', '.')
// 'file1.test'
```

## \_substringAfter

```ts
_substringAfter('file1.test.ts', '.')
// 'test.ts'
```

## \_substringAfterLast

```ts
_substringAfterLast('file1.test.ts', '.')
// 'ts'
```

## \_substringBetweenLast

```ts
const s = '/Users/lalala/someFile.test.ts'
_substringBetweenLast(s, '/', '.'))
// 'someFile'
```

## \_truncate

Truncates the string to the needed length, putting `...` (or a custom "ending") in the end, if
needed. The `maxLen` (second argument) **includes** the "ending string" (3rd argument).

```ts
_truncate('Hello World!', 5) // 'He...'
_truncate('Hello World!', 6) // 'Hel...'
_truncate('Hello World!', 100) // 'Hello World!' (no truncation needed)

// Custom "ending"
_truncate('Hello World!', 5, '|') // 'Hell|'
```

## \_truncateMiddle

Truncates the string in the middle.

```ts
_truncateMiddle('abcdefghijklmnopqrstuvwxyz', 10)
// 'abcd...xyz'
```

## \_replaceAll

Polyfill for
[String.prototype.replaceAll](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll).

Based on regex implementation (slightly faster than "split/join" implementation).

## \_nl2br

Converts `\n` (aka new-line) to `<br>`, to be presented in HTML.

Keeps `\n`, so if it's printed in non-HTML environment it still looks ok-ish.

## \_parseQueryString

Parses `location.search` string (e.g `?a=1&b=2`) into a StringMap, e.g: `{ a: '1', b: '2' }`

Pass `location.search` to it in the Frontend, or any other string on the Backend (where
`location.search` is not available).

Works both with and without leading `?` character.

Yes, there's [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
existing in the Frontend (not in Node yet), but it's API is not as convenient. And the
implementation here is super-small.

Goal of this function is to produce exactly same output as `URLSearchParams` would.

```ts
// Assuming url is http://example.com?a=1&b=2

_parseQueryString(location.search)
// { a: '1', b: '2' }
```
