## @naturalcycles/js-lib

> Standard library for universal (browser + Node.js) javascript

[![npm](https://img.shields.io/npm/v/@naturalcycles/js-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/js-lib)
[![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/js-lib)](https://bundlephobia.com/result?p=@naturalcycles/js-lib)
[![ci](https://circleci.com/gh/NaturalCycles/js-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/js-lib)
[![loc](https://badgen.net/codeclimate/loc/NaturalCycles/js-lib)](https://github.com/NaturalCycles/js-lib)
[![Maintainability](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/maintainability)](https://codeclimate.com/github/NaturalCycles/js-lib/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/test_coverage)](https://codeclimate.com/github/NaturalCycles/js-lib/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Design

Inspired by [Lodash](https://lodash.com/docs/),
[bluebird](https://github.com/petkaantonov/bluebird),
[promise-fun](https://github.com/sindresorhus/promise-fun) and other useful small packages.

Designed to play well with the rest of opinionated "Natural Cycles JS Platform" (link pending). This
package is the lowest-level production dependency (not `devDependency`) of the Platform. Almost
everything else depends on it.

All functions in this package are exported in `index.ts` (flat), no namespacing is used. So, to
avoid conflicts and "global import namespace" pollution , all functions are prefixed with an
underscore (e.g `_.pick` becomes `_pick`), with some exceptions (later). Promise functions are
prefixed with `p`, e.g `pMap`.

Decorators are _prefixed and PascalCased (e.g `@_Debounce`).
`_`is to be consistent with other naming in this package. PascalCase is to distinguish decorators from similar functions that are not decorators. Example:`\_debounce`is a function (lodash-based),`\_Debounce`is a decorator (used as`@\_Debounce`).
PascalCase convention follows Angular/Ionic convention (but doesn't follow TypeScript documentation
convention; we had to pick one).

Interfaces and Classes are named as usual (no prefix, PascalCase, e.g `AppError`).

Q: Why not just use lodash?

A:

- We believe Lodash is outdated (many functions are pre-ES6 / obsolete by ES6).
- Because it has so many outdated functions - its size is bigger, and solutions to tree-shake exist,
  but complicated.
- First-class TypeScript support (all code in this repo is TypeScript).

This package is intended to be 0-dependency, "not bloated", tree-shakeable. Supported by reasonably
modern Browsers and Node.js latest LTS.

To fulfil that requirement it exports ESM version (for Browsers) as es2015, to support Browsers that
don't natively support async/await (es2017).

Exports default CJS version for Node as es2017 (with native async/await, for better performance,
async stack-traces, etc).

## Mutation

All function does **NOT** mutate the arguments by default.

Many functions support "mutation flag", which can be set to `true` to perform a mutation.

For example:

```typescript
const obj = { a: 'a', b: 'b' }

// Non-mutating (default)
const obj2 = _pick(obj, ['a'])
// { a: 'a' }

// Mutating (opt-in)
_pick(obj, ['a'], true)
// obj was mutated
```

# Highlights

- `pMap` (based on https://github.com/sindresorhus/p-map)
- `StringMap`
- `@_Memo`
- `_merge` (based on https://gist.github.com/Salakar/1d7137de9cb8b704e48a)
- `_deepEquals` (based on https://github.com/epoberezkin/fast-deep-equal/)
- `_sortObjectDeep` (based on https://github.com/IndigoUnited/js-deep-sort-object)
- `_set` (based on https://stackoverflow.com/a/54733755/4919972)
- `_unset` (based on https://github.com/jonschlinkert/unset-value)
- ...

# API

- [Promise utils](#promise-utils)
- [Object](#object)
- [Array](#array)
- [String](#string)
- [Number](#number)
- [Json](#json)
- [Time](#time)
- [Math](#math)
- [Units](#units)
- [Decorators](#decorators)
- [Error utils](#error-utils)
- [Types](#types)

#### Promise utils

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

###### pMap

Based on https://github.com/sindresorhus/p-map

###### pProps

Based on https://github.com/sindresorhus/p-props

###### pFilter

Based on https://github.com/sindresorhus/p-filter

###### pDefer

Allows to create a "ResolvablePromise", which is a normal native Promise (so, can be awaited, etc),
extended with `.resolve()` and `.reject()` methods, so you can control it. Similar to jQuery's
Deferred, or RxJS's Subject (which is both an Observable and allows to emit values).

```typescript
// todo: example
```

###### pRetry

Based on https://github.com/sindresorhus/p-retry

###### pDelay

Based on https://github.com/sindresorhus/delay

```typescript
// todo: example
```

###### pHang

```typescript
// todo: example
```

###### pState

```typescript
// todo: example
```

###### pBatch

```typescript
// todo: example
```

#### Object

###### \_pick

Inspired by Lodash's [\_.pick](https://lodash.com/docs/#pick).

```typescript
_pick({ a: 'a', b: 'b', c: 'c' }, ['a', 'b'])
// { a: 'a', b: 'b' }

_pick({ a: 'a', b: 'b', c: 'c' }, ['a'])
// { a: 'a' }

_pick({ a: 'a', b: 'b', c: 'c' }, ['d'])
// {}

_pick({ a: 'a', b: 'b', c: 'c' }, [])
// {}

// Supports "mutation flag" which would mutate the object and return it (same object):
const obj = { a: 'a', b: 'b', c: 'c' }
const obj2 = _pick(obj, ['a'], true)
obj === obj2 // true
```

###### \_omit

Inspired by Lodash's [\_.omit](https://lodash.com/docs/#omit). The opposite of `_pick`.

```typescript
_omit({ a: 'a', b: 'b', c: 'c' }, ['a', 'b'])
// { c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, ['a'])
// {  b: 'b', c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, ['d'])
// { a: 'a', b: 'b', c: 'c' }

_omit({ a: 'a', b: 'b', c: 'c' }, [])
// { a: 'a', b: 'b', c: 'c' }

// Supports "mutation flag" which would mutate the object and return it (same object):
const obj = { a: 'a', b: 'b', c: 'c' }
const obj2 = _omit(obj, ['a', 'b'], true)
obj === obj2 // true
```

###### \_mask

Similar to `_omit`, but supports deep object access via dot-notation (`a.b`). Supports "mutation
flag" argument.

```typescript
const obj = {
  a: 'a',
  b: {
    b1: 'b1',
    b2: 'b2',
  },
}

_mask(obj, ['b.b1'])
// { a: 'a', b: { b1: 'b1' }}

_mask(obj, ['b.b1'], true)
// obj was mutated
```

###### \_filterFalsyValues

###### \_filterUndefinedValues

###### \_filterObject

###### \_mapValues

###### \_mapKeys

###### \_mapObject

###### \_objectNullValuesToUndefined

###### \_deepCopy

###### \_isPrimitive

###### \_merge

###### \_deepTrim

###### \_sortObjectDeep

###### \_unset

###### \_getKeyByValue

###### \_invert

###### \_invertMap

###### \_get

###### \_set

###### \_has

###### \_deepEquals

#### Array

###### \_range

###### \_chunk

###### \_flatten

###### \_flattenDeep

###### \_uniq

###### \_uniqBy

###### \_by

###### \_sortBy

###### \_intersection

Inspired by Lodash's [\_.intersection](https://lodash.com/docs/#intersection).

```typescript
_intersection([2, 1], [2, 3])
// [2]

_intersection([1], [2])
// []

_intersection()
// []

_intersection([1])
// [1]
```

###### \_difference

Inspired by Lodash's [\_.difference](https://lodash.com/docs/#difference)

```typescript
_difference([2, 1], [2, 3])
// [1]

_difference([1], [2])
// [1]

_difference([1], [1])
// []

_difference([1])
// [1]
```

#### String

###### \_capitalize

###### \_upperFirst

###### \_lowerFirst

###### \_split

###### \_substringBefore

###### \_substringBeforeLast

###### \_substringAfter

###### \_substringAfterLast

###### \_truncate

###### \_truncateMiddle

#### Number

###### \_inRange

#### Json

###### \_jsonParseIfPossible

###### \_stringifyAny

#### Time

###### \_ms

###### \_since

###### \_debounce

###### \_throttle

#### Math

###### \_randomInt

###### SimpleMovingAverage

#### Units

###### \_kb, \_mb, \_gb, \_hb

#### Decorators

###### @\_Debounce

###### @\_Throttle

###### @\_LogMethod

###### @\_Memo

###### @\_Retry

#### Error utils

###### AggregatedError

###### \_tryCatch

###### AppError

###### HttpError

###### ErrorObject

###### HttpErrorResponse

###### \_anyToAppError

###### \_anyToErrorObject

###### \_anyToErrorMessage

###### \_errorToErrorObject

###### \_errorObjectToAppError

###### \_errorObjectToHttpError

###### \_appErrorToErrorObject

###### \_appErrorToHttpError

###### \_isHttpErrorResponse

###### \_isHttpErrorObject

###### \_isErrorObject

#### Types

Things that should exist in [type-fest](https://github.com/sindresorhus/type-fest), but don't (yet).

###### StringMap

```typescript
const m: StringMap = { a: 'a' }
// Same as:
// const m: { [a: string]: string | undefined }

const m: StringMap<number> = { a: 5 }
// Same as:
// const m: { [a: string]: number | undefined }
```

# Packaging

- `engines.node >= Node.js LTS`
- `main: dist/index.js`: commonjs, es2017 - targeting Node.js
- `module: dist-esm/index.js`: esm, es2015 - targeting Browsers
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
