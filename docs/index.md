# js-lib

> Standard library for universal (browser + Node.js) javascript

<style>
.badges p {
    display: flex;
    gap: 10px;
}

</style>

<div class="badges">

![npm](https://img.shields.io/npm/v/@naturalcycles/js-lib/latest.svg)
![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/js-lib)
![Actions](https://github.com/NaturalCycles/js-libs/workflows/ci/badge.svg)
![loc](https://badgen.net/codeclimate/loc/NaturalCycles/js-libs)

</div>
<div class="badges">

![Maintainability](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/maintainability)
![Test Coverage](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/test_coverage)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

</div>

## Design

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

This package is intended to be 0-dependency (exception: [tslib](https://github.com/Microsoft/tslib)
from TypeScript), "not bloated", tree-shakeable. Supported by reasonably modern Browsers and Node.js
latest LTS.

## Mutation

All function does **NOT** mutate the arguments by default.

Many functions support "mutation flag", which can be set to `true` to perform a mutation.

For example:

```ts
const obj = { a: 'a', b: 'b' }

// Non-mutating (default)
const obj2 = _pick(obj, ['a'])
// { a: 'a' }

// Mutating (opt-in)
_pick(obj, ['a'], true)
// obj was mutated
```

## Highlights

- `pMap` (based on https://github.com/sindresorhus/p-map)
- `StringMap`
- `@_Memo`
- `_merge` (based on https://gist.github.com/Salakar/1d7137de9cb8b704e48a)
- `_deepEquals` (based on https://github.com/epoberezkin/fast-deep-equal/)
- `_sortObjectDeep` (based on https://github.com/IndigoUnited/js-deep-sort-object)
- `_set` (based on https://stackoverflow.com/a/54733755/4919972)
- `_unset` (based on https://github.com/jonschlinkert/unset-value)
- ...
