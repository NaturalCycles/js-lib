## @naturalcycles/js-lib

> Standard library for universal (browser + Node.js) javascript

[![npm](https://img.shields.io/npm/v/@naturalcycles/js-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/js-lib)
[![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/js-lib)](https://bundlephobia.com/result?p=@naturalcycles/js-lib)
[![](https://circleci.com/gh/NaturalCycles/js-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/js-lib)
[![Maintainability](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/maintainability)](https://codeclimate.com/github/NaturalCycles/js-lib/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c2dc8d53bd79f79b1d8b/test_coverage)](https://codeclimate.com/github/NaturalCycles/js-lib/test_coverage)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

- Decorators
  - `memo`, `memoCache`
- Error
  - `AppError`
- Utils
  - `objectSharedUtil`
  - `randomSharedUtil`
  - `scriptSharedUtil`
  - `stringSharedUtil`
- Services
  - `sentryService`
- Testing
  - `testSharedUtil`
- `types`

  - `StringMap`
  - `PromiseMap`

- ... there's more...

# What should go in this lib

- Only **universal** code that works equally good in the browser and on the server. Otherwise -
  there are other libs specifically for browser and node.
- Only battle-tested code with solid proven APIs that are not supposed to change.
- Only fully unit-tested code with coverage very close to 100%. All the branches should absolutely
  be tested.
- Only generic and broad purpose functions, no domain or project-specific code.
- Library- and framework-agnostic, only based on standard JS or TypeScript apis. There are few
  exceptions for extremely popular dependencies, that will go as `peerDependencies` in this project,
  in order for the consuming project to have control over the version of each dependency (in their
  `yarn.lock`).

# Packaging

- `engines.node >= 8.11`: Node.js LTS
- `main: dist/index.js`: commonjs, es2015
- `module: dist-esm/index.js`: esm, es2015
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included
